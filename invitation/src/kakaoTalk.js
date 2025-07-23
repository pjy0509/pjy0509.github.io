import Utils from "./utils.js";
import Constant from "./constant.js";

const KakaoTalk = {
	JSKey: "81d57ff9f2d2a5524e506d8a1d386fd5",
	RestAPIKey: "7c29ec39d56410088e1ba66176d61b4b",
	init: function () {
		window.KakaoTalk = KakaoTalk;
		
		Kakao.init(KakaoTalk.JSKey);
	},
	openCalendar: function () {
		const scheme = "kakaotalk://calendar/home"
			+ "?date=" + encodeURIComponent(Constant.WEDDING_DATE_ISO_STRING);
		
		const fallback = "https://calendar.kakao.com/"
			+ "?date=" + encodeURIComponent(Constant.WEDDING_DATE_ISO_STRING);
		
		Native.App.open({
			[Native.Constants.OS.Android]: {
				scheme: scheme,
			},
			[Native.Constants.OS.iOS]: {
				scheme: scheme,
			},
			[Native.Constants.OS.Windows]: {
				fallback: fallback
			},
			[Native.Constants.OS.MacOS]: {
				fallback: fallback
			}
		});
		
		const destructor = Utils.runAndOn(
			function () {
				if (document.visibilityState === "visible") {
					KakaoTalk.closeInAppBrowser();
					destructor();
				}
			},
			document,
			"visibilitychange"
		)
	},
	createSchedule: function () {
		let kakaoAccessToken = localStorage.getItem("kakaoAccessToken");
		
		if (!kakaoAccessToken) {
			init();
		} else {
			create();
		}
		
		function fetchWithAuthRetry(input, options) {
			return fetch(input, options).then(async (response) => {
				if (response.status === 401) {
					localStorage.removeItem("kakaoAccessToken");
					kakaoAccessToken = null;
					init();
				}
				return response;
			});
		}
		
		function init() {
			const search = new URLSearchParams(location.search);
			const clientId = encodeURIComponent(KakaoTalk.RestAPIKey);
			const redirectURI = encodeURIComponent(location.origin + location.pathname + "?mode=schedule");
			
			if (search.has("code")) {
				const grantType = encodeURIComponent("authorization_code");
				const code = search.get("code");
				
				window.history.replaceState(null, '', location.protocol + "//" + location.host + location.pathname + "?mode=schedule" + location.hash);
				
				fetch(
					"https://kauth.kakao.com/oauth/token"
					+ "?grant_type=" + grantType
					+ "&client_id=" + clientId
					+ "&redirect_uri=" + redirectURI
					+ "&code=" + code,
					{
						method: "POST"
					}
				)
					.then(response => response.json())
					.then(response => {
						localStorage.setItem("kakaoAccessToken", kakaoAccessToken = response.access_token);
						KakaoTalk.createSchedule();
					});
			} else {
				const responseType = encodeURIComponent("code");
				const scope = encodeURIComponent("talk_calendar");
				
				location.href = "https://kauth.kakao.com/oauth/authorize"
					+ "?client_id=" + clientId
					+ "&redirect_uri=" + redirectURI
					+ "&response_type=" + responseType
					+ "&scope=" + scope;
			}
		}
		
		function create() {
			fetch(
				"https://dapi.kakao.com/v2/local/search/keyword.JSON"
				+ "?query=" + encodeURIComponent(Constant.PLACE_NAME)
				+ "&x=" + encodeURIComponent(Constant.LONGITUDE)
				+ "&y=" + encodeURIComponent(Constant.LATITUDE),
				{
					headers: {
						"Authorization": "KakaoAK " + KakaoTalk.RestAPIKey,
					}
				}
			)
				.then(response => response.json())
				.then(response => {
					const locationID = response.documents[0].id;
					
					const body = {
						title: Constant.GROOM + "❤️" + Constant.BRIDE + " 결혼식",
						time: {
							start_at: Constant.WEDDING_DATE_TIME_START_ISO_STRING,
							end_at: Constant.WEDDING_DATE_TIME_END_ISO_STRING,
							time_zone: Constant.TIMEZONE,
							all_day: false,
							lunar: false
						},
						description: Constant.META_DESCRIPTION,
						location: {
							name: Constant.PLACE_NAME,
							location_id: locationID,
							address: Constant.PLACE_ADDRESS,
							latitude: Constant.LATITUDE,
							longitude: Constant.LONGITUDE
						},
						reminders: [60, 120],
						color: "PINK"
					};
					
					fetchWithAuthRetry(
						"https://kapi.kakao.com/v2/api/calendar/events"
						+ "?from=" + encodeURIComponent(Constant.WEDDING_DATE_TIME_START_ISO_STRING)
						+ "&to=" + encodeURIComponent(Constant.WEDDING_DATE_TIME_END_ISO_STRING),
						{
							headers: {
								"Authorization": "Bearer " + kakaoAccessToken,
							}
						}
					)
						.then(response => response.json())
						.then(response => {
							const matched = response.events.find(e => e.title === body.title);
							
							if (!matched) {
								const bodyString = JSON.stringify(body);
								
								return fetchWithAuthRetry(
									"https://kapi.kakao.com/v2/api/calendar/create/event",
									{
										method: "POST",
										headers: {
											"Authorization": "Bearer " + kakaoAccessToken,
											"Content-Type": "application/x-www-form-urlencoded"
										},
										body: "event=" + encodeURIComponent(bodyString),
									}
								)
									.then(response => response.json())
									.then(KakaoTalk.openCalendar);
							} else {
								return KakaoTalk.openCalendar();
							}
						});
				});
		}
	},
	openExternalBrowser: function () {
		location.href = "kakaotalk://web/openExternal?url=" + encodeURIComponent(location.href);
	},
	closeInAppBrowser: function () {
		if (document.documentElement.dataset.wv !== "kakao") return;
		if (Native.Platform.os === "iOS") return location.href = "kakaoweb://closeBrowser";
		return location.href = "kakaotalk://inappbrowser/close";
	},
	share: function () {
		Kakao.Share.sendDefault({
			objectType: "feed",
			content: {
				title: "자세히 보기",
				description: "https://pjy0509.github.io/invitation",
				imageUrl: Constant.META_IMAGE,
				link: {
					mobileWebUrl: "https://pjy0509.github.io/invitation",
					webUrl: "https://pjy0509.github.io/invitation",
				},
			},
			itemContent: {
				profileText: Constant.META_TITLE,
			},
			buttons: [
				{
					title: "찾아오는 길",
					link: {
						mobileWebUrl: "https://pjy0509.github.io/invitation?mode=route",
						webUrl: "https://pjy0509.github.io/invitation?mode=route",
					},
				},
				{
					title: "일정 등록",
					link: {
						mobileWebUrl: "https://pjy0509.github.io/invitation?mode=schedule",
						webUrl: "https://pjy0509.github.io/invitation?mode=schedule",
					},
				}
			],
		});
	}
};

export default KakaoTalk;
