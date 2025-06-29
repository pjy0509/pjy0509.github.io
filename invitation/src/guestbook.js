import Modal from "./modal.js";
import Toast from "./toast.js";

const Guestbook = {
	endpoint: "https://js66lnf7lyuhvono47zx2dsgoy0vagno.lambda-url.ap-northeast-2.on.aws/",
	page: 1,
	size: 3,
	total: 0,
	count: 0,
	fetching: false,
	boards: [],
	appended: 0,
	removeTargetId: null,
	init: async function () {
		window.Guestbook = Guestbook;
		await Guestbook.loadNext();
		Guestbook.render({rerender: true});
		
		if (Guestbook.count >= Guestbook.total) {
			document.getElementById("guestbook-mask").style.display = "none";
			document.getElementById("guestbook-show-more").style.display = "none";
		}
	},
	loadNext: async function () {
		if (Guestbook.fetching) return;
		Guestbook.fetching = true;
		
		try {
			const res = await fetch(
				Guestbook.endpoint
				+ "?page=" + Guestbook.page
				+ "&size=" + Guestbook.size
				+ "&from=" + Guestbook.appended
			);
			const data = await res.json();
			
			Guestbook.total = data.count;
			Guestbook.boards = [...Guestbook.boards, ...data.boards];
			Guestbook.count = Guestbook.boards.length;
			Guestbook.page++;
		} catch (e) {
		} finally {
			Guestbook.fetching = false;
		}
	},
	render: function ({rerender = false, startIndex = 0} = {}) {
		const container = document.getElementById("guestbook");
		if (rerender) container.innerHTML = "";
		
		for (let i = startIndex; i < Guestbook.boards.length; i++) {
			const el = Guestbook.createMemoElement(Guestbook.boards[i], i);
			container.prepend(el);
		}
		
		if (!rerender) {
			requestAnimationFrame(() => {
				void container.offsetWidth;
				
				container.closest(".item-container").scrollIntoView({behavior: "smooth", block: "end"});
			});
		}
	},
	createMemoElement: function (data, index) {
		const rand = [[2, 4, 6], [1, 3, 5]][Math.abs(index) % 2][Math.floor(Math.random() * 3)];
		const rotate = Math.floor(Math.random() * 10) - 5;
		const signed = Math.random() < 0.5 ? -1 : 1;
		
		const marginTop = {1: "-4rem", 2: "-4rem", 3: "-6rem", 4: "-6rem", 5: "-4rem", 6: "-4rem"};
		const top = {1: "25%", 2: "25%", 3: "37%", 4: "37%", 5: "25%", 6: "25%"};
		const buttonTop = {1: "-10%", 2: "-10%", 3: "-15%", 4: "-15%", 5: "-10%", 6: "-10%"};
		const height = {1: "63%", 2: "60%", 3: "52%", 4: "54%", 5: "60%", 6: "60%"};
		const rotateContent = {1: -4, 2: 0, 3: 0, 4: 0, 5: 0, 6: 4};
		
		const imgContainer = document.createElement("div");
		imgContainer.style.marginLeft = (Math.abs(index) % 2 === 0 ? 1 : -1) * (Math.floor(Math.random() * 2) + 2) + "rem";
		imgContainer.style.marginTop = marginTop[rand];
		imgContainer.dataset.guestbookId = data.id;
		
		const img = document.createElement("img");
		img.src = "assets/images/board/memo" + rand + ".png";
		img.style.transform = "rotate(" + rotate + "deg) scaleX(" + signed + ")";
		
		const contentContainer = document.createElement("div");
		contentContainer.className = "content-container";
		contentContainer.style.transform = "rotate(" + (rotate + signed * rotateContent[rand]) + "deg)";
		contentContainer.style.top = top[rand];
		contentContainer.style.height = height[rand];
		
		const removeButton = document.createElement("button");
		removeButton.style.top = buttonTop[rand];
		removeButton.textContent = "×";
		
		const content = document.createElement("div");
		content.className = "content";
		content.textContent = data.content;
		
		const writer = document.createElement("div");
		writer.className = "writer";
		writer.textContent = data.writer;
		
		const createDate = document.createElement("div");
		createDate.className = "create-date";
		createDate.textContent = toFormatString(data.create_date);
		
		const writerContainer = document.createElement("div");
		writerContainer.className = "writer-container";
		writerContainer.append(createDate, writer);
		
		contentContainer.append(content, writerContainer, removeButton);
		imgContainer.append(img, contentContainer);
		
		removeButton.onclick = () => {
			Guestbook.removeTargetId = data.id;
			
			Modal.show("guestbook-remove");
		}
		
		return imgContainer;
	},
	showMore: async function () {
		const previousLength = Guestbook.boards.length;
		await Guestbook.loadNext();
		
		Guestbook.render({startIndex: previousLength});
		
		if (Guestbook.count >= Guestbook.total) {
			document.getElementById("guestbook-mask").style.display = "none";
			document.getElementById("guestbook-show-more").style.display = "none";
		}
	},
	write: async function () {
		try {
			const writerEl = document.getElementById("guestbook-writer");
			const passwordEl = document.getElementById("guestbook-password");
			const contentEl = document.getElementById("guestbook-content");
			
			const writer = writerEl.value.trim();
			const password = passwordEl.value;
			const content = contentEl.value.trim();
			
			if (writer === "") return Toast.show("성함을 입력해 주세요.", "error");
			if (password === "") return Toast.show("비밀번호를 입력해 주세요.", "error");
			if (content === "") return Toast.show("내용을 입력해 주세요.", "error");
			
			const res = await fetch(
				`${Guestbook.endpoint}`,
				{
					method: "POST",
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						writer: writer,
						password: password,
						content: content,
					})
				});
			
			const statusCode = res.status;
			
			if (statusCode < 200 || statusCode >= 400) return;
			
			const newMemo = await res.json();
			
			Modal.hide("guestbook");
			
			Guestbook.boards.unshift(newMemo);
			
			const container = document.getElementById("guestbook");
			const memoEl = Guestbook.createMemoElement(newMemo, -(Guestbook.appended + 1));
			
			container.append(memoEl);
			
			++Guestbook.count;
			++Guestbook.total;
			++Guestbook.appended;
			
			requestAnimationFrame(() => {
				void container.offsetWidth;
				
				memoEl.scrollIntoView({behavior: "smooth", block: "center"});
			});
			
			Toast.show("방명록을 작성했습니다.", "success");
		} catch (e) {
		}
	},
	remove: async function () {
		const passwordEl = document.getElementById("guestbook-password-check");
		
		const password = passwordEl.value;
		
		if (password === "") return Toast.show("비밀번호를 입력해 주세요.", "error");
		
		const res = await fetch(
			`${Guestbook.endpoint}`,
			{
				method: "DELETE",
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: Guestbook.removeTargetId,
					password: password,
				})
			});
		
		const statusCode = res.status;
		
		if (statusCode === 403) {
			return Toast.show("비밀번호가 일치하지 않습니다.", "error");
		}
		
		if (statusCode < 200 || statusCode >= 400) return;
		
		Guestbook.boards = Guestbook.boards.filter(memo => memo.id !== Guestbook.removeTargetId);
		Guestbook.count--;
		Guestbook.total--;
		
		const container = document.getElementById("guestbook");
		const children = [...container.children];
		for (const el of children) {
			if (el.dataset.guestbookId === Guestbook.removeTargetId.toString()) {
				container.removeChild(el);
				break;
			}
		}
		
		Modal.hide("guestbook-remove");
		Guestbook.removeTargetId = null;
		
		Toast.show("방명록을 삭제했습니다.", "success");
	}
};

dayjs.extend(dayjs_plugin_advancedFormat);

function toFormatString(date) {
	return dayjs(date).locale("ko").format("YYYY. M. D. hh:mm");
}

export default Guestbook;
