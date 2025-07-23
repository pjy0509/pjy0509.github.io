import Utils from "./utils.js";
import Constant from "./constant.js";
import Accordion from "./accordion.js";

const Navigation = {
	method: null,
	selectedPark: null,
	DayType: {
		Rest: 0,
		Sat: 1,
		Sun: 2,
		Weekday: 3,
	},
	init: function (fullscreen = false) {
		window.Navigation = Navigation;
		
		const prefix = fullscreen ? "[data-fullscreen=\"route\"] " : "";
		const routes = document.querySelector(prefix + ".item-routes");
		
		document.querySelectorAll(prefix + "[data-map-type]").forEach(el => {
			el.onclick = function () {
				Navigation.open(this.dataset.mapType);
			}
		});
		
		function setHeight(container) {
			function maxHeight(items) {
				const width = window.innerWidth;
				
				return Math.ceil(items / (width >= 500 ? 3 : width >= 380 ? 2 : 1)) * 3 + 1;
			}
			
			switch (Native.Platform.os) {
				case "Android":
					return container.style.height = maxHeight(5) + "rem";
				case "iOS":
					return container.style.height = maxHeight(6) + "rem";
				case "Windows":
					return container.style.height = maxHeight(3) + "rem";
				case "MacOS":
					return container.style.height = maxHeight(4) + "rem";
			}
		}
		
		Utils.runAndOn(
			() => setHeight(routes),
			window,
			"resize",
			300
		);
		
		const observer = new MutationObserver(mutations => {
			observer.disconnect();
			
			const map = document.querySelector(prefix + ".item-location .map .wrap_map");
			
			document.querySelectorAll(prefix + ".cont .section")
				.forEach((section, i) => {
					const title = section.querySelector(".title");
					
					if (title !== null) {
						const toggle = document.createElement("div");
						const id = i.toString();
						
						toggle.dataset.accordionToggle = id;
						
						title.appendChild(toggle);
						title.style.display = "flex";
						title.style.justifyContent = "space-between";
						title.style.alignItems = "center";
						title.style.flexDirection = "row";
						title.style.margin = "0";
						title.dataset.accordionHeader = "";
						title.dataset.accordionExtra = id;
						section.dataset.accordion = id;
						
						Accordion.init(id);
					}
				});
			
			const scrollElement = Utils.getSimpleBarScrollElement(document.body);
			
			Utils.runAndOn(
				() => {
					map.style.pointerEvents = "none";
				},
				scrollElement,
				"scroll"
			);
			
			Utils.on(
				() => {
					map.style.pointerEvents = "unset";
				},
				scrollElement,
				"scroll",
				(Native.Platform.os === "Android" || Native.Platform.os === "iOS") ? 500 : 1000
			);
		});
		
		observer.observe(document.querySelector(prefix + ".item-location"), {childList: true, subtree: true});
		
		new daum.roughmap.Lander({
			timestamp: fullscreen ? "1750768592006" : "1750165976255",
			key: fullscreen ? "44xtndib8ms" : "3pycungqfsg",
			mapWidth: "360",
			mapHeight: "240"
		})
			.render();
		
		const ul = document.querySelector(prefix + "[data-selector]");
		let method = localStorage.getItem("method");
		
		if (method === null) method = "car";
		
		function onclick() {
			ul.childNodes.forEach(node => {
				if (node instanceof HTMLElement) {
					if (node === this) node.classList.add("selected");
					else node.classList.remove("selected");
				}
			});
			
			const newMethod = this.dataset.value;
			
			routes.dataset.method = Navigation.method = newMethod;
			localStorage.setItem("method", newMethod);
			
			Navigation.setRouteEndpoint(fullscreen);
		}
		
		ul.childNodes.forEach(node => {
			if (node instanceof HTMLElement) {
				node.onclick = onclick.bind(node);
				
				if (node.dataset.value === method) {
					node.classList.add("selected");
					routes.dataset.method = this.method = method;
				}
			}
		});
		
		const parkList = document.querySelector(prefix + ".park-list");
		
		this.park()
			.then(parks => {
				parks
					.filter(park => park.distance === undefined || park.distance < 1000)
					.forEach((park, i) => {
						const container = document.createElement("div");
						const title = document.createElement("div");
						const name = document.createElement("strong");
						const button = document.createElement("button");
						const count = document.createElement("div");
						const time = document.createElement("p");
						
						container.classList.add("park-container");
						title.classList.add("park-title");
						button.classList.add("park-button");
						
						if (i === 0) {
							button.classList.add("selected");
							container.dataset.accordionHeader = "";
						}
						
						button.onclick = function () {
							parkList.querySelectorAll(prefix + ".park-button").forEach(button => {
								if (this === button) button.classList.add("selected");
								else button.classList.remove("selected");
							});
							
							if (i === 0) Navigation.selectedPark = null;
							else Navigation.selectedPark = park;
							
							Navigation.setRouteEndpoint(fullscreen);
						};
						
						title.append(
							name,
							button
						);
						
						name.innerText = park.name.replace(/(주차장)|$/, "주차장");
						count.innerText = "주차 수용 대수: " + park.parkCount;
						
						if (park.isLive) {
							const live = document.createElement("span");
							
							live.innerText = "현재 " + (park.parkCount - park.liveCount) + "대 주차가능";
							
							count.append(live);
						}
						
						container.append(
							title,
							count
						);
						
						if (park.baseTime !== 0) {
							const base = document.createElement("div");
							
							if (park.basePrice > 0) {
								base.innerText = "기본: " + park.baseTime + "분 " + park.basePrice.toLocaleString('ko-KR') + "원";
							} else {
								base.innerText = "무료: " + park.baseTime + "분";
							}
							
							container.append(base);
						}
						
						if (park.addTime !== 0) {
							const add = document.createElement("div");
							
							add.innerText = "유료: " + park.addTime + "분당 " + park.addPrice.toLocaleString('ko-KR') + "원";
							
							container.append(add);
						}
						
						if (park.address !== undefined) {
							const address = document.createElement("p");
							
							address.innerText = "주소: " + park.address;
							
							container.append(address);
						}
						
						if (park.distance !== undefined) {
							const distance = document.createElement("p");
							
							if (park.distance > 1000) {
								distance.innerText = "거리: " + (park.distance / 1000).toFixed(3) + "km";
							} else {
								distance.innerText = "거리: " + (park.distance).toFixed(0) + "m";
							}
							
							container.append(distance);
						}
						
						if (park.beginHour !== undefined && park.beginMinute !== undefined && park.endHour !== undefined && park.endMinute !== undefined) {
							time.innerText = "운영 시간: ";
							
							if (park.beginHour === 0 && park.beginMinute === 0 && park.endHour === 0 && park.endMinute === 0) {
								time.innerText += "하루 종일";
							} else {
								if (park.beginHour >= 12) {
									time.innerText += "오후 " + (park.beginHour - 12);
								} else {
									time.innerText += "오전 " + park.beginHour;
								}
								
								time.innerText += "시 ";
								
								if (park.beginMinute !== 0) {
									time.innerText += park.beginMinute + "분 ";
								}
								
								time.innerText += "~ ";
								
								if (park.endHour >= 12) {
									time.innerText += "오후 " + (park.endHour - 12);
								} else {
									time.innerText += "오전 " + park.endHour;
								}
								
								time.innerText += "시 ";
								
								if (park.endMinute !== 0) {
									time.innerText += park.endMinute + "분 ";
								}
							}
							
							container.append(time);
						}
						
						if (park.description !== undefined) {
							const description = document.createElement("p");
							
							description.innerText = park.description;
							
							container.append(description);
						}
						
						parkList.append(container);
					});
				
				Accordion.init(fullscreen ? "fullscreen-park" : "park");
			});
		
		Navigation.setRouteEndpoint(fullscreen);
	},
	open: function (type) {
		let scheme,
			intent,
			fallback;
		
		let latitude = Constant.LATITUDE,
			longitude = Constant.LONGITUDE,
			placeName = Constant.PLACE_NAME,
			placeAddress = Constant.PLACE_ADDRESS;
		
		if (this.method === "car" && this.selectedPark !== null) {
			latitude = this.selectedPark.latitude;
			longitude = this.selectedPark.longitude;
			placeName = this.selectedPark.name;
			placeAddress = this.selectedPark.address;
		}
		
		switch (type) {
			case "t-map":
				scheme = "tmap://route"
					+ "?goaly=" + encodeURIComponent(latitude)
					+ "&goalx=" + encodeURIComponent(longitude)
					+ "&goalname=" + encodeURIComponent(placeName);
				
				Native.App.open({
					[Native.Constants.OS.Android]: {
						scheme: scheme,
						package: "com.skt.tmap.ku",
					},
					[Native.Constants.OS.iOS]: {
						scheme: scheme,
						trackId: "431589174",
					}
				});
				
				return;
			case "naver-map":
				scheme = "nmap://"
					+ (this.method === "car" ? "navigation" : this.method === "transit" ? "route/public" : this.method === "walk" ? "route/walk" : "")
					+ "?dlat=" + encodeURIComponent(latitude)
					+ "&dlng=" + encodeURIComponent(longitude)
					+ "&dname=" + encodeURIComponent(placeName)
					+ "&appname=" + encodeURIComponent(location.origin);
				
				fallback = "http://map.naver.com/index.nhn"
					+ "?elat=" + encodeURIComponent(latitude)
					+ "&elng=" + encodeURIComponent(longitude)
					+ "&etext=" + encodeURIComponent(placeName)
					+ "&menu=" + encodeURIComponent("route")
					+ "&pathType=" + encodeURIComponent(this.method === "car" ? "0" : this.method === "transit" ? "1" : this.method === "walk" ? "3" : "");
				
				Native.App.open({
					[Native.Constants.OS.Android]: {
						scheme: scheme,
						package: "com.nhn.android.nmap",
					},
					[Native.Constants.OS.iOS]: {
						scheme: scheme,
						trackId: "311867728",
					},
					[Native.Constants.OS.Windows]: {
						fallback: fallback
					},
					[Native.Constants.OS.MacOS]: {
						fallback: fallback
					}
				});
				
				return;
			case "kakao-map":
				scheme = "kakaomap://route"
					+ "?ep=" + encodeURIComponent(latitude + "," + longitude)
					+ "&by=" + encodeURIComponent(this.method === "car" ? "0" : this.method === "transit" ? "PUBLICTRANSIT" : this.method === "walk" ? "FOOT" : "");
				
				fallback = "https://map.kakao.com/link/to/"
					+ encodeURIComponent(placeName + "," + latitude + "," + longitude);
				
				Native.App.open({
					[Native.Constants.OS.Android]: {
						scheme: scheme,
						package: "net.daum.android.map",
					},
					[Native.Constants.OS.iOS]: {
						scheme: scheme,
						trackId: "304608425",
					},
					[Native.Constants.OS.Windows]: {
						fallback: fallback
					},
					[Native.Constants.OS.MacOS]: {
						fallback: fallback
					}
				});
				
				return;
			case "kakao-navi":
				Kakao.Navi.start({
					name: placeName,
					x: +longitude,
					y: +latitude,
					coordType: "wgs84",
				});
				return;
			case "kakao-taxi":
				scheme = "kakaot://launch"
					+ "?page=" + encodeURIComponent("search")
					+ "&dest_lat=" + encodeURIComponent(latitude)
					+ "&dest_lng=" + encodeURIComponent(longitude)
					+ "&dest_name=" + encodeURIComponent(placeName);
				
				Native.App.open({
					[Native.Constants.OS.Android]: {
						scheme: scheme,
						package: "com.kakao.taxi",
					},
					[Native.Constants.OS.iOS]: {
						scheme: scheme,
						trackId: "981110422",
					}
				});
				
				return;
			case "google-map":
				if (Native.Platform.os === "Android") {
					if (this.method === "transit") {
						scheme = "https://maps.google.com/maps"
							+ "?daddr=" + encodeURIComponent(placeName)
							+ "&directionsmode=" + encodeURIComponent("transit");
					} else {
						scheme = "google.navigation://maps.google.com/maps"
							+ "?q=" + encodeURIComponent(placeName)
							+ "&mode=" + encodeURIComponent(this.method === "car" ? "d" : this.method === "walk" ? "w" : "");
					}
				} else {
					scheme = "comgooglemaps://"
						+ "?daddr=" + encodeURIComponent(placeName)
						+ "&center=" + encodeURIComponent(latitude + "," + longitude)
						+ "&directionsmode=" + encodeURIComponent(this.method === "car" ? "driving" : this.method === "transit" ? "transit" : this.method === "walk" ? "walking" : "");
				}
				
				fallback = "https://www.google.co.kr/maps/dir//"
					+ encodeURIComponent(placeAddress + " " + placeName);
				
				Native.App.open({
					[Native.Constants.OS.Android]: {
						scheme: scheme,
						package: "com.google.android.apps.maps",
					},
					[Native.Constants.OS.iOS]: {
						scheme: scheme,
						trackId: "585027354",
					},
					[Native.Constants.OS.Windows]: {
						fallback: fallback
					},
					[Native.Constants.OS.MacOS]: {
						fallback: fallback
					}
				});
				
				return;
			case "apple-map":
				scheme = "maps://"
					+ "?daddr=" + encodeURIComponent(latitude + "," + longitude)
					+ "&dirflg=" + encodeURIComponent(this.method === "car" ? "d" : this.method === "transit" ? "r" : this.method === "walk" ? "w" : "");
				
				Native.App.open({
					[Native.Constants.OS.iOS]: {
						scheme: scheme,
					},
					[Native.Constants.OS.MacOS]: {
						scheme: scheme,
					}
				});
				
				return;
			case "uber-taxi":
				scheme = "uber://"
					+ "?action=setPickup"
					+ "&pickup=my_location"
					+ "&dropoff[latitude]=" + encodeURIComponent(latitude)
					+ "&dropoff[longitude]=" + encodeURIComponent(longitude)
					+ "&dropoff[nickname]=" + encodeURIComponent(placeName);
				
				fallback = "https://m.uber.com/go/home"
					+ "?drop%5B0%5D=" + encodeURIComponent(
						JSON.stringify({
							addressLine1: placeName,
							latitude: +latitude,
							longitude: +longitude,
							source: "SEARCH",
							provider: "tmap_places"
						})
					);
				
				Native.App.open({
					[Native.Constants.OS.Android]: {
						scheme: scheme,
						package: "com.ubercab",
					},
					[Native.Constants.OS.iOS]: {
						scheme: scheme,
						trackId: "431589174",
					},
					[Native.Constants.OS.Windows]: {
						fallback: fallback
					},
					[Native.Constants.OS.MacOS]: {
						fallback: fallback
					}
				});
		}
	},
	park: async function () {
		async function getDayType() {
			const year = Constant.WEDDING_DATE_TIME_START.getFullYear().toString();
			const month = (Constant.WEDDING_DATE_TIME_START.getMonth() + 1).toString().padStart(2, '0');
			const day = Constant.WEDDING_DATE_TIME_START.getDay();
			
			return await fetch(
				"https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo"
				+ "?serviceKey=" + encodeURIComponent("cwrcT5TevRi39dJ3+8FTHHLLQyxGCWKNdMYBYqAwwrCHqPAK/1ZHilEhfJ31syfsZ1BOVUiLL4DIjRLU+Hfg2w==")
				+ "&solYear=" + encodeURIComponent(year)
				+ "&solMonth=" + encodeURIComponent(month)
			)
				.then(response => response.text())
				.then(response => {
					const parser = new DOMParser();
					const xml = parser.parseFromString(response, "application/xml");
					
					if (xml.querySelector("parsererror") === null) {
						const dateString = year + month + Constant.WEDDING_DATE_TIME_START.getDate().toString().padStart(2, '0');
						
						for (let item of xml.getElementsByTagName("items")[0].children) {
							if (dateString === item.getElementsByTagName("locdate")[0].textContent) return Navigation.DayType.Rest;
						}
						
						if (day === 6) return Navigation.DayType.Sat;
						if (day === 0) return Navigation.DayType.Sun;
						return Navigation.DayType.Weekday;
					}
				})
				.catch(() => {
					if (day === 6) return Navigation.DayType.Sat;
					if (day === 0) return Navigation.DayType.Sun;
					return Navigation.DayType.Weekday;
				});
		}
		
		async function getParks() {
			const beginHM = Constant.WEDDING_DATE_TIME_START.getHours() * 100 + Constant.WEDDING_DATE_TIME_START.getMinutes();
			const endHM = Constant.WEDDING_DATE_TIME_END.getHours() * 100 + Constant.WEDDING_DATE_TIME_END.getMinutes();
			const dayType = await getDayType();
			
			try {
				return await Promise.all([
					await fetchProxy("http://openapi.seoul.go.kr:8088/4c41556673716b7234387474764c46/json/GetParkInfo/1/1000/영등포구")
						.then(response => response.json())
						.then(response => Array.from(new Map(response.GetParkInfo.row.map(park => [park.PKLT_CD, park])).values())
							.filter(park => {
								if (park.OPER_SE !== "1" || park.PKLT_KND === "NS" || park.LAT === 0 || park.LOT === 0) return false;
								
								const [parkBeginHM, parkEndHM] =
									dayType === Navigation.DayType.Rest
										? [+park.LHLDY_BGNG, +park.LHLDY]
										: (dayType === Navigation.DayType.Sat || dayType === Navigation.DayType.Sun)
											? [+park.WE_OPER_BGNG_TM, +park.WE_OPER_END_TM]
											: [+park.WD_OPER_BGNG_TM, +park.WD_OPER_END_TM];
								
								return !(parkBeginHM === 0 && parkEndHM === 0) && (parkBeginHM < beginHM && (parkEndHM > endHM || beginHM > endHM));
							})),
					
					await fetchProxy("http://openapi.seoul.go.kr:8088/4c41556673716b7234387474764c46/json/GetParkingInfo/1/1000/영등포구")
						.then(response => response.json())
						.then(response => Array.from(new Map(response.GetParkingInfo.row.map(park => [park.PKLT_CD, park])).values())
							.filter(park => park.PRK_STTS_YN === "1")
						)
				])
					.then(([parks, lives]) => {
						return parks
							.map(park => {
								const [parkBeginHM, parkEndHM] =
									dayType === Navigation.DayType.Rest
										? [+park.LHLDY_BGNG, +park.LHLDY]
										: (dayType === Navigation.DayType.Sat || dayType === Navigation.DayType.Sun)
											? [+park.WE_OPER_BGNG_TM, +park.WE_OPER_END_TM]
											: [+park.WD_OPER_BGNG_TM, +park.WD_OPER_END_TM];
								
								const isFree = dayType === Navigation.DayType.Rest
									? park.LHLDY_YN
									: dayType === Navigation.DayType.Sat
										? park.SAT_CHGD_FREE_SE
										: park.CHGD_FREE_SE;
								
								let isLive = park.PRK_NOW_INFO_PVSN_YN === "1";
								
								const latitude = park.LAT,
									longitude = park.LOT,
									name = park.PKLT_NM.replaceAll(/(^공유\)\s*)|\s*(\([구|시]\)$)/g, "");
								
								let baseTime = park.PRK_HM,
									basePrice = park.PRK_CRG,
									addTime = park.ADD_UNIT_TM_MNT,
									addPrice = park.ADD_CRG;
								
								if (addTime === 0 && addPrice === 0) {
									addTime = baseTime;
									addPrice = basePrice;
								}
								
								let liveCount = null,
									liveTime = null
								
								if (isLive) {
									const index = lives.findIndex(live => live.PKLT_CD === park.PKLT_CD);
									
									if (index !== -1) {
										const live = lives.splice(index, 1)[0];
										
										liveCount = live.NOW_PRK_VHCL_CNT;
										liveTime = live.NOW_PRK_VHCL_UPDT_TM;
									} else {
										isLive = false;
									}
								}
								
								return {
									id: park.PKLT_CD,
									name: name,
									address: park.ADDR,
									parkCount: park.TPKCT,
									parkSyncTime: park.LAST_DATA_SYNC_TM,
									liveCount: liveCount,
									liveSyncTime: liveTime,
									tel: park.TELNO,
									baseTime: baseTime,
									basePrice: basePrice,
									addTime: addTime,
									addPrice: addPrice,
									maxPrice: park.DLY_MAX_CRG,
									latitude: park.LAT,
									longitude: park.LOT,
									isFree: isFree === "N",
									isLive: isLive,
									distance: getDistance(Constant.LATITUDE, Constant.LONGITUDE, latitude, longitude),
									beginHour: Math.floor(parkBeginHM / 100),
									beginMinute: parkBeginHM % 100,
									endHour: Math.floor(parkEndHM / 100) % 24,
									endMinute: parkEndHM % 100,
								}
							})
							.sort((a, b) => a.distance - b.distance)
					});
			} catch (e) {
				return [];
			}
		}
		
		const parks = await getParks();
		
		parks.unshift({
			name: Constant.PLACE_NAME + " 주차장",
			parkCount: Constant.PARK_COUNT,
			basePrice: Constant.PARK_BASE_PRICE,
			baseTime: Constant.PARK_BASE_TIME,
			addPrice: Constant.PARK_ADD_PRICE,
			addTime: Constant.PARK_ADD_TIME,
			description: Constant.PARK_DESCRIPTION
		});
		
		return parks;
	},
	setRouteEndpoint: function (fullscreen) {
		const name = document.querySelector(fullscreen ? "[data-fullscreen=\"route\"] [data-route-endpoint-name]" : "[data-route-endpoint-name]");
		const postposition = document.querySelector(fullscreen ? "[data-fullscreen=\"route\"] [data-route-endpoint-postposition]" : "[data-route-endpoint-postposition]");
		
		let endpoint;
		
		if (Navigation.method === "car") {
			if (Navigation.selectedPark === null) {
				endpoint = Constant.PLACE_NAME;
			} else {
				endpoint = Navigation.selectedPark.name.replace(/(주차장)|$/, "주차장");
			}
		} else {
			endpoint = Constant.PLACE_NAME;
		}
		
		name.textContent = endpoint;
		postposition.textContent = hasFinalConsonant(endpoint) ? "로" : "으로";
	}
};

function degree2Radian(degree) {
	return degree * (Math.PI / 180);
}

function getDistance(latitude1, longitude1, latitude2, longitude2) {
	const dLat = degree2Radian(latitude2 - latitude1),
		dLon = degree2Radian(longitude2 - longitude1),
		a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(degree2Radian(latitude1)) * Math.cos(degree2Radian(latitude2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	
	return 6.371e6 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function hasFinalConsonant(text) {
	const firstHangul = 44032;
	const lastHangul = 55203;
	
	const lastStrCode = text.charCodeAt(text.length - 1);
	
	if (lastStrCode < firstHangul || lastStrCode > lastHangul) return false;
	return (lastStrCode - firstHangul) % 28 === 0;
}

async function fetchProxy(url, options = {}) {
	return await fetch(
		"https://lqpcufd4zapvf3ldssafva36le0bvjcf.lambda-url.ap-northeast-2.on.aws?url=" + encodeURIComponent(url),
		options
	);
}

export default Navigation;
