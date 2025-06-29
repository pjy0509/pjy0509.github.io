import Utils from "./utils.js";

const Constant = {
	GROOM: "박준영",
	GROOM_PHONE: "010-7195-6148",
	GROOM_BANK: "KB국민은행",
	GROOM_ACCOUNT_NO: "93770200397592",
	GROOM_KAKAO_PAY_LINK: "https://qr.kakaopay.com/Ej8s6SDI0",
	BRIDE: "최영은",
	BRIDE_BANK: "신한은행",
	BRIDE_ACCOUNT_NO: "110436552640",
	BRIDE_KAKAO_PAY_LINK: "https://qr.kakaopay.com/Ej89EJVN2",
	BRIDE_PHONE: "010-8891-3169",
	GROOM_FATHER: "박영호",
	GROOM_FATHER_PHONE: "010-3653-5977",
	GROOM_FATHER_BANK: undefined,
	GROOM_FATHER_ACCOUNT_NO: undefined,
	GROOM_FATHER_KAKAO_PAY_LINK: undefined,
	GROOM_MOTHER: "김인숙",
	GROOM_MOTHER_PHONE: "010-9011-6148",
	GROOM_MOTHER_BANK: "카카오뱅크",
	GROOM_MOTHER_ACCOUNT_NO: "3333236768704",
	GROOM_MOTHER_KAKAO_PAY_LINK: "https://qr.kakaopay.com/FTfimikk7",
	BRIDE_FATHER: undefined,
	BRIDE_FATHER_PHONE: undefined,
	BRIDE_FATHER_BANK: undefined,
	BRIDE_FATHER_ACCOUNT_NO: undefined,
	BRIDE_FATHER_KAKAO_PAY_LINK: undefined,
	BRIDE_MOTHER: "김도연",
	BRIDE_MOTHER_PHONE: "010-4923-1385",
	BRIDE_MOTHER_BANK: undefined,
	BRIDE_MOTHER_ACCOUNT_NO: undefined,
	BRIDE_MOTHER_KAKAO_PAY_LINK: undefined,
	LATITUDE: "37.52137722994085",
	LONGITUDE: "126.90459301926333",
	PLACE_NAME: "웨딩그룹위더스 영등포",
	PLACE_ADDRESS: "서울특별시 영등포구 영중로 55",
	PLACE_TEL: "02-6418-3000",
	TIMEZONE: "Asia/Seoul",
	WEDDING_DATE_TIME_START_ISO_STRING: "2025-08-31T03:20:00Z",
	WEDDING_DATE_TIME_END_ISO_STRING: "2025-08-31T04:30:00Z",
	WEDDING_DATE_ISO_STRING: "2025-08-31",
	PARK_COUNT: 600,
	PARK_ADD_TIME: 10,
	PARK_ADD_PRICE: 500,
	PARK_BASE_TIME: 120,
	PARK_BASE_PRICE: 0,
	PARK_DESCRIPTION: "예식날 주차장과 엘레베이터가 인기만점입니다. 대중교통 이용 혹은 도착 예정시간 보다 여유있는 출발 부탁드립니다. 양해 감사합니다.",
	META_TITLE: document.querySelector("meta[property=\"og:title\"]").content,
	META_DESCRIPTION: document.querySelector("meta[property=\"og:description\"]").content,
	WEDDING_DATE_TIME_START: null,
	WEDDING_DATE_TIME_END: null,
	WEDDING_DATE: null,
	init: function () {
		window.Constant = Constant;
		
		Constant.WEDDING_DATE_TIME_START = new Date(this.WEDDING_DATE_TIME_START_ISO_STRING);
		Constant.WEDDING_DATE_TIME_END = new Date(this.WEDDING_DATE_TIME_END_ISO_STRING);
		Constant.WEDDING_DATE = new Date(this.WEDDING_DATE_ISO_STRING);
		
		dayjs.extend(dayjs_plugin_advancedFormat);
		
		const date = dayjs(Constant.WEDDING_DATE_TIME_START);
		
		document.querySelectorAll("[data-wedding-date-time]").forEach(el => el.textContent = date.locale(el.dataset.weddingDateTimeLocale).format(el.dataset.weddingDateTime));
		document.querySelectorAll("[data-require-groom-father]").forEach(el => Constant.GROOM_FATHER === undefined ? el.remove() : el);
		document.querySelectorAll("[data-require-groom-mother]").forEach(el => Constant.GROOM_MOTHER === undefined ? el.remove() : el);
		document.querySelectorAll("[data-require-bride-father]").forEach(el => Constant.BRIDE_FATHER === undefined ? el.remove() : el);
		document.querySelectorAll("[data-require-bride-mother]").forEach(el => Constant.BRIDE_MOTHER === undefined ? el.remove() : el);
		document.querySelectorAll("[data-require-groom-father-account]").forEach(el => Constant.GROOM_FATHER_ACCOUNT_NO === undefined ? el.remove() : el);
		document.querySelectorAll("[data-require-groom-mother-account]").forEach(el => Constant.GROOM_MOTHER_ACCOUNT_NO === undefined ? el.remove() : el);
		document.querySelectorAll("[data-require-bride-father-account]").forEach(el => Constant.BRIDE_FATHER_ACCOUNT_NO === undefined ? el.remove() : el);
		document.querySelectorAll("[data-require-bride-mother-account]").forEach(el => Constant.BRIDE_MOTHER_ACCOUNT_NO === undefined ? el.remove() : el);
		document.querySelectorAll("[data-groom]").forEach(el => el.textContent = Constant.GROOM);
		document.querySelectorAll("[data-groom-phone]").forEach(el => el.textContent = Constant.GROOM_PHONE);
		document.querySelectorAll("[data-groom-bank]").forEach(el => el.textContent = Constant.GROOM_BANK);
		document.querySelectorAll("[data-groom-account-no]").forEach(el => el.textContent = Constant.GROOM_ACCOUNT_NO);
		document.querySelectorAll("[data-groom-father]").forEach(el => el.textContent = Constant.GROOM_FATHER);
		document.querySelectorAll("[data-groom-father-phone]").forEach(el => el.textContent = Constant.GROOM_FATHER_PHONE);
		document.querySelectorAll("[data-groom-father-bank]").forEach(el => el.textContent = Constant.GROOM_FATHER_BANK);
		document.querySelectorAll("[data-groom-father-account-no]").forEach(el => el.textContent = Constant.GROOM_FATHER_ACCOUNT_NO);
		document.querySelectorAll("[data-groom-mother]").forEach(el => el.textContent = Constant.GROOM_MOTHER);
		document.querySelectorAll("[data-groom-mother-phone]").forEach(el => el.textContent = Constant.GROOM_MOTHER_PHONE);
		document.querySelectorAll("[data-groom-mother-bank]").forEach(el => el.textContent = Constant.GROOM_MOTHER_BANK);
		document.querySelectorAll("[data-groom-mother-account-no]").forEach(el => el.textContent = Constant.GROOM_MOTHER_ACCOUNT_NO);
		document.querySelectorAll("[data-bride]").forEach(el => el.textContent = Constant.BRIDE);
		document.querySelectorAll("[data-bride-phone]").forEach(el => el.textContent = Constant.BRIDE_PHONE);
		document.querySelectorAll("[data-bride-bank]").forEach(el => el.textContent = Constant.BRIDE_BANK);
		document.querySelectorAll("[data-bride-account-no]").forEach(el => el.textContent = Constant.BRIDE_ACCOUNT_NO);
		document.querySelectorAll("[data-bride-father]").forEach(el => el.textContent = Constant.BRIDE_FATHER);
		document.querySelectorAll("[data-bride-father-phone]").forEach(el => el.textContent = Constant.BRIDE_FATHER_PHONE);
		document.querySelectorAll("[data-bride-father-bank]").forEach(el => el.textContent = Constant.BRIDE_FATHER_BANK);
		document.querySelectorAll("[data-bride-father-account-no]").forEach(el => el.textContent = Constant.BRIDE_FATHER_ACCOUNT_NO);
		document.querySelectorAll("[data-bride-mother]").forEach(el => el.textContent = Constant.BRIDE_MOTHER);
		document.querySelectorAll("[data-bride-mother-phone]").forEach(el => el.textContent = Constant.BRIDE_MOTHER_PHONE);
		document.querySelectorAll("[data-bride-mother-bank]").forEach(el => el.textContent = Constant.BRIDE_MOTHER_BANK);
		document.querySelectorAll("[data-bride-mother-account-no]").forEach(el => el.textContent = Constant.BRIDE_MOTHER_ACCOUNT_NO);
		document.querySelectorAll("[data-place-name]").forEach(el => el.textContent = Constant.PLACE_NAME);
		document.querySelectorAll("[data-place-address]").forEach(el => el.textContent = Constant.PLACE_ADDRESS);
		
		document.querySelectorAll("[data-messenger-type]").forEach(element => {
			const args = {type: element.dataset.messengerType};
			
			switch (element.dataset.messengerValue) {
				case "groom-phone":
					args.to = Constant.GROOM_PHONE;
					break;
				case "groom-father-phone":
					args.to = Constant.GROOM_FATHER_PHONE;
					break;
				case "groom-mother-phone":
					args.to = Constant.GROOM_MOTHER_PHONE;
					break;
				case "bride-phone":
					args.to = Constant.BRIDE_PHONE;
					break;
				case "bride-father-phone":
					args.to = Constant.BRIDE_FATHER_PHONE;
					break;
				case "bride-mother-phone":
					args.to = Constant.BRIDE_MOTHER_PHONE;
					break;
			}
			
			const messenger = new Native.Messenger(args);
			
			element.onclick = () => {
				messenger.run();
			}
		});
		
		document.querySelectorAll("[data-bank-type]").forEach(element => {
			const type = element.dataset.bankType;
			const key = element.dataset.accountValue;
			const isApp = Native.OS.name === "Android" || Native.OS.name === "iOS";
			const qrContainer = document.getElementById("qr-code");
			let bank;
			let accountNo;
			let kakaoPayLink;
			
			switch (key) {
				case "groom-account":
					bank = Constant.GROOM_BANK;
					accountNo = Constant.GROOM_ACCOUNT_NO;
					kakaoPayLink = Constant.GROOM_KAKAO_PAY_LINK;
					break;
				case "groom-father-account":
					bank = Constant.GROOM_FATHER_BANK;
					accountNo = Constant.GROOM_FATHER_ACCOUNT_NO;
					kakaoPayLink = Constant.GROOM_FATHER_KAKAO_PAY_LINK;
					break;
				case "groom-mother-account":
					bank = Constant.GROOM_MOTHER_BANK;
					accountNo = Constant.GROOM_MOTHER_ACCOUNT_NO;
					kakaoPayLink = Constant.GROOM_MOTHER_KAKAO_PAY_LINK;
					break;
				case "bride-account":
					bank = Constant.BRIDE_BANK;
					accountNo = Constant.BRIDE_ACCOUNT_NO;
					kakaoPayLink = Constant.BRIDE_KAKAO_PAY_LINK;
					break;
				case "bride-father-account":
					bank = Constant.BRIDE_FATHER_BANK;
					accountNo = Constant.BRIDE_FATHER_ACCOUNT_NO;
					kakaoPayLink = Constant.BRIDE_FATHER_KAKAO_PAY_LINK;
					break;
				case "bride-mother-account":
					bank = Constant.BRIDE_MOTHER_BANK;
					accountNo = Constant.BRIDE_MOTHER_ACCOUNT_NO;
					kakaoPayLink = Constant.BRIDE_KAKAO_PAY_LINK;
					break;
			}
			
			switch (type) {
				case "copy":
					element.onclick = async () => {
						try {
							await Utils.copy(accountNo);
							Toast.show("계좌번호를 복사했습니다.", "success");
						} catch (e) {
							Toast.show("계좌번호를 복사하지 못했습니다.", "error");
						}
					}
					break;
				case "toss":
				case "kakao":
					const isToss = type === "toss";
					
					let scheme = isToss
						? "supertoss://send"
						+ "?amount=" + "0"
						+ "&bank=" + encodeURIComponent(bank)
						+ "&accountNo=" + encodeURIComponent(accountNo)
						+ "&origin=" + "qr"
						: kakaoPayLink;
					let packageName = isToss ? "viva.republica.toss" : undefined;
					let trackId = isToss ? "839333328" : undefined;
					let image = isToss ? "../assets/images/icon_toss_hd.png" : "../assets/images/icon_kakaotalk_hd.png";
					
					if (!isToss && kakaoPayLink === undefined) {
						return element.remove();
					}
					
					element.onclick = async () => {
						if (isApp) {
							if (type === "kakao") {
								Utils.recordScrollY();
							}
							
							new Native.App({
								android: {
									scheme: scheme,
									package: packageName,
								},
								ios: {
									scheme: scheme,
									trackId: trackId,
								},
							})
								.run();
						} else {
							qrContainer.childNodes.forEach(node => node.remove());
							
							new QRCodeStyling({
								width: 200,
								height: 200,
								type: "svg",
								data: scheme,
								image: image,
								margin: 0,
								qrOptions: {
									typeNumber: "0",
									errorCorrectionLevel: "H"
								},
								dotsOptions: {
									color: "#000000",
									type: "square"
								},
								backgroundOptions: {
									color: "transparent",
								},
								imageOptions: {
									margin: 6,
								}
							})
								.append(qrContainer);
							
							Modal.show("bank");
						}
					}
					break;
				
			}
		});
	}
};

export default Constant;
