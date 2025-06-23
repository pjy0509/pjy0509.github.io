const Constant = {
	GROOM: "박준영",
	BRIDE: "최영은",
	GROOM_FATHER: "박영호",
	GROOM_MOTHER: "김인숙",
	BRIDE_FATHER: undefined,
	BRIDE_MOTHER: "김도연",
	GROOM_PHONE: "010-7195-6148",
	GROOM_FATHER_PHONE: "010-3653-5977",
	GROOM_MOTHER_PHONE: "010-9011-6148",
	BRIDE_PHONE: "010-8891-3169",
	BRIDE_FATHER_PHONE: undefined,
	BRIDE_MOTHER_PHONE: "010-4923-1385",
	LATITUDE: "37.52137722994085",
	LONGITUDE: "126.90459301926333",
	PLACE_NAME: "웨딩그룹위더스 영등포",
	PLACE_ADDRESS: "서울 영등포구 영중로 55",
	TIMEZONE: "Asia/Seoul",
	WEDDING_DATE_TIME_START_ISO_STRING: "2025-08-31T03:20:00Z",
	WEDDING_DATE_TIME_END_ISO_STRING: "2025-08-31T04:30:00Z",
	WEDDING_DATE_ISO_STRING: "2025-08-31",
	PARK_COUNT: 600,
	PARK_ADD_TIME: 10,
	PARK_ADD_PRICE: 500,
	PARK_BASE_TIME: 120,
	PARK_BASE_PRICE: 0,
	PARK_DESCRIPTION: "예식 날 주차가 혼잡하니 대중교통 이용 혹은 도착 예정 시간보다 여유 있는 출발 권장해 드립니다.",
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
		document.querySelectorAll("[data-groom]").forEach(el => el.textContent = Constant.GROOM);
		document.querySelectorAll("[data-groom-father]").forEach(el => el.textContent = Constant.GROOM_FATHER);
		document.querySelectorAll("[data-groom-mother]").forEach(el => el.textContent = Constant.GROOM_MOTHER);
		document.querySelectorAll("[data-groom-phone]").forEach(el => el.textContent = Constant.GROOM_PHONE);
		document.querySelectorAll("[data-groom-father-phone]").forEach(el => el.textContent = Constant.GROOM_FATHER_PHONE);
		document.querySelectorAll("[data-groom-mother-phone]").forEach(el => el.textContent = Constant.GROOM_MOTHER_PHONE);
		document.querySelectorAll("[data-bride]").forEach(el => el.textContent = Constant.BRIDE);
		document.querySelectorAll("[data-bride-father]").forEach(el => el.textContent = Constant.BRIDE_FATHER);
		document.querySelectorAll("[data-bride-mother]").forEach(el => el.textContent = Constant.BRIDE_MOTHER);
		document.querySelectorAll("[data-bride-phone]").forEach(el => el.textContent = Constant.BRIDE_PHONE);
		document.querySelectorAll("[data-bride-father-phone]").forEach(el => el.textContent = Constant.BRIDE_FATHER_PHONE);
		document.querySelectorAll("[data-bride-mother-phone]").forEach(el => el.textContent = Constant.BRIDE_MOTHER_PHONE);
		document.querySelectorAll("[data-require-groom-father]").forEach(el => Constant.GROOM_FATHER === undefined ? el.remove() : el);
		document.querySelectorAll("[data-require-groom-mother]").forEach(el => Constant.GROOM_MOTHER === undefined ? el.remove() : el);
		document.querySelectorAll("[data-require-bride-father]").forEach(el => Constant.BRIDE_FATHER === undefined ? el.remove() : el);
		document.querySelectorAll("[data-require-bride-mother]").forEach(el => Constant.BRIDE_MOTHER === undefined ? el.remove() : el);
		document.querySelectorAll("[data-place-name]").forEach(el => el.textContent = Constant.PLACE_NAME);
		document.querySelectorAll("[data-place-address]").forEach(el => el.textContent = Constant.PLACE_ADDRESS);
		
		document.querySelectorAll("[data-messenger-type]").forEach(element => {
			const args = {
				"type": element.dataset.messengerType,
			}
			
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
			
			element.onclick = function () {
				messenger.run();
			}
		});
	}
};

export default Constant;
