'use strict'
//# - Означает переделанные пункты на новые.

let API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
let Shop = document.querySelector('.shop');

// № 4 Создаем функцию с помощью которой будем отправлять запросы на сервер
// function makeGETRequest(url, callback) {
// 	var xhr = new XMLHttpRequest();
// 	xhr.onreadystatechange = () => {
// 		if (xhr.readyState === 4) {
// 			if (xhr.status !== 200) {
// 				console.log(error);
// 			} else {
// 				callback(xhr.responseText);
// 			}
// 		}
// 	}
// 	xhr.open('GET', url, true);
// 	xhr.send();
// }\



//№5 Создаем базовый класс списка товара. В нем может быть много разных данных у котрого мы будем наследоваться дальше.

//url - адресс файла json который нужно плучить
//container - элемент в котором будет отображать наш список

class List {
	constructor(url, container, list = list2) {
		// ссылка на сервер
		this.url = url;
		// наша обертка (див в котором будет отображена Карточка)
		this.container = container;
		this.list = list;
		//временный массив в который мы получаем с сервера товары.
		this.goods = [];
		//массив с готовыми экземплярами некоторых элементов
		this.allProducts = [];
		// Создаем массив в котором будет хранится найденные совпадаения на странице
		this.filtered = [];
		//метод инициализации
		this.init();
	}

	//№6 Получение данных в формате json будет принимать json. Мы получаем данные оп url. Если их нету то будет через API
	// getJson(url) {
	// 	// получаем данные по url если он есть. Если нет то по апи
	// 	return fetch(url ? url : `${API_URL + this.url}`)
	// 		//получаем какие то данные и переформатируем их в json
	// 		.then(result => result.json())
	// 		//Если нет то выдем ошибку
	// 		.catch(error => {
	// 			console.log(error);
	// 		})
	// }

	//№ 7 Обработка данныз data. Эти данные необходи для того чтоб добавить их в наш массив goods 
	handleData(data) {
		//Передоваемые данные в (data) помещаются в массив.
		this.goods = [...data];
		// после того как товары получены будем выполнять метод Render
		this.render();
	}
	//№8 Пренесли  метод подсчета общей стоимость всех продуктов и отобразим на странице.
	// calcSum() {
	// 	let totalPrice = null;
	// 	this.products.forEach(sum => {
	// 		totalPrice += sum.price;
	// 	});
	// 	Shop.insertAdjacentHTML('afterend', `<div id = "totalPrice" > Общая сумма товаров составляет: ${totalPrice} рублей.</div > `);
	// }

	// calcSum() {
	// 	this.allProducts.reduce((accum, item) => accum += item.price, 0);

	// }

	//№9 Метод рендер будет похож на другие render
	render() {
		const block = document.querySelector(this.container);
		//мы итерируем перевалосный массив goods в ктором хранитятся данные необходимые к отображению 
		//массив this.gooods это переалочный массив в котором хрнаятся данные
		for (let product of this.goods) {
			//Создадим экземпляр нового товара и обращаемся к названию конструктора которое соответвствует ProductList. Если вызвать с корзины то будет имя корзины
			const productObj = new this.list[this.constructor.name](product); //18 минута 4 урока
			// И помещаем экземпляр в наш массив где будет хранится все.
			this.allProducts.push(productObj);
			// Все что получили будем отоборжать на станице с помощью метода render (ProductItem.render)
			block.insertAdjacentHTML('beforeend', productObj.render());
		}
	}
	// Метод Фильтр будет доступен для всего. Можно и вкорзине искать.
	filter(value) {
		//Создаем новое Регулярное выражание и передаем туда то что написал на пользователь
		const regexp = new RegExp(value, 'i');
		// Проверяем массив AllProducts на совпадение. Если они есть то помещаем их в наш массив Filtered
		this.filtered = this.allProducts.filter(product =>
			regexp.test(product.product_name));
		//Console.log(regexp);
		//Пребераме массив со всеми товарами.
		this.allProducts.forEach(el => {
			//Console.log(el);
			// Через метод ForEach перебираем массив находим элемент с передаваемыем именем и помещаем его в блок по ID
			const block = document.querySelector(`.product-item[data-id=" ${el.id_product}"]`);
			// console.log(block);
			if (!this.filtered.includes(el)) { // INcluDES для массива
				// Contains для строки
				block.classList.add('hidden');
			} else {
				block.classList.remove('hidden');
			}
		})
	}
	// №5
	init() {
		return false
	}

}

// №10 Создаем базовый класс для одного элемента любого списка.
class Item {
	constructor(el, img = 'https://avatarko.ru/img/kartinka/32/Halloween_31492.jpg') {
		this.product_name = el.product_name;
		this.price = el.price;
		this.id_product = el.id_product;
		this.img = img;
	}

	render() {
		return `<div class="product-item" data-id=" ${this.id_product}" >
								<div class="img-property">
										<img src="${this.img}" alt="" >
								</div>
								<div class="description" >
										<section class="desc-content">
												<h3>${this.product_name}</h3>
												<p>${this.price} p.</p>
										</section>
										<button class="btn-buy" type="button"
										data-id = "${this.id_product}"
										data-name = "${this.product_name}"
										data-price = "${this.price}"
										>Купить</button>
								</div>
						</div> `
	}
}


//№ 3 Создаем класс для списка всех товаров.
class ProductsList extends List {
	//cart - это будет ссылкой на обьект карзины. В нем будет метод добовления товара в корзину
	constructor(cart, container = '.shop', url = "/catalogData.json") {
		//cart  - корзина. ссылка обькт корзины. У неё будет доступна ссылка на метод добавления товара в корзину. Мы связываем 2 обьекта вместе.
		super(url, container);
		this.cart = cart;
		//Вызываем метод получения даных от сервера и обрабатываем через handleData  и добовляем их в массив goods
		this.getJson()
			.then(data => this.handleData(data));
	}
	// метод инициализации кнопки. Вешаем обработчик события на Родителя и ловим момент. как только мы нажали кнопку с классом () то все данные кнопки (ид. имя. цена) прилетают нам в метод addProduct
	init() {
		document.querySelector(this.container).addEventListener('click', e => {
			if (e.target.classList.contains('btn-buy')) {
				//Будем вызвывать метод addProduct в Корзине и передаем наши данные e.target/
				// В кнопке лежит ИД ИМЯ 
				this.cart.addProduct(e.target);
			}
		});
		// Метод инициализации фильтра. Будем искать нужные товары
		document.querySelector('.search-form').addEventListener('submit', e => {
			e.preventDefault(); // Убираем базовые вызова.
			// Вызываем метод Filter и передаем туда то что ввел пользователь
			this.filter(document.querySelector('.search-field').value)
		})
	}
}
// constructor(container = '.shop') {
// 	this.container = container;
// 	// мы знаем что наша переменная будет хранить массив, а что внутри мы не знаем. В любой момент мы можем переопределить, что там будет хранится.
// 	this.products = [];
// 	//Создаим общий массив для хранения всех экземляров товаров. Создаем его для того, чтобы в дальнейшем нам получать свойства или данные.
// 	this.allProducts = [];
// 	this.fetchProducts();
// }
// создаем массив с данными нашего продукта. Эти данные мы придумали и будем их получать при запросе.

// fetchProducts(cb) {

// // Тут мы заменили наш массив на получаемые данные из сервера. Использование колбэков плохо сказывается на коде. Есть более новая запись

// 	makeGETRequest(`${ API_URL } /catalogData.json`, (data) => {
// 		this.products = JSON.parse(data);
// 		cb();
// 	})
// }

// Запишем наш вызов в более новом коде с использованием  fetch 

// fetchProducts() {
// 	fetch(`${API_URL}/catalogData.json`)
// 		.then(result => result.json())
// 		.then(data => {
// 			this.products = [...data];
// 			this.render();
// 		})
// 		.catch(error => {
// 			console.log(error);
// 		});
// }

// // Метод рендор будет отображать нам все элементы продукта на странице.
// render() {
// 	const block = document.querySelector(this.container);
// 	for (let goods of this.products) {
// 		//Создадим экземпляр нового товара
// 		const productObj = new ProductItem(goods);
// 		// И помещаем экземпляр в наш массив где будет хранится все.
// 		this.allProducts.push(productObj);
// 		// Все что получили будем отоборжать на станице с помощью метода render (ProductItem.render)
// 		block.insertAdjacentHTML('beforeend', productObj.render());
// 	}
// }
// };


//№1 Создаем класс одного продукта (карточки)
class ProductItem extends Item {
	// 	constructor(product, img = 'https://avatarko.ru/img/kartinka/32/Halloween_31492.jpg') {
	// 		this.product_name = product.product_name;
	// 		this.price = product.price;
	// 		this.id_product = product.id_product;
	// 		this.img = img;
	// 	}

	// 	// №2 Макет разметки. Её мы добавим на старницу при помощи метода 
	// 	render() {
	// 		return `<div class="product-item" data-id=" ${this.id_product}">
	// 								<div class="img-property">
	// 										<img src="${this.img}" alt="" >
	// 								</div>
	// 								<div class="description" >
	// 										<section class="desc-content">
	// 												<h3>${this.product_name}</h3>
	// 												<p>${this.price} p.</p>
	// 												<p>${this.count} шт.</p>
	// 										</section>
	// 										<button class="btn-buy" type="button">Купить</button>
	// 								</div>
	// 						</div>`
	// 	}
};

//Создаем карзину и будем наследовать от List	
class Cart extends List {
	constructor(container = '.basket', url = '/getBasket.json') {
		super(url, container);
		this.getJson()
			.then(data => {
				this.handleData(data.contents)
			});
	}
	//Добавление товара в корзину. Если мы добавили или удалили товар то на сервере мы должны это отображать 
	// addProduct(element) {
	// 	this.getJson(`${API_URL}/addToBasket.json`)
	// 		.then(data => {
	// 			if (data.result === 1) {
	// 				// В пременную помещеаем то что мы получили с сервера и присваиваем ей айди продукта
	// 				let productId = +element.dataset['id'];
	// 				// Просматриваем массив где лежат все продукты и проверяем есть ли данный айди-продукт в данном массиве. Если еть то добовляем его колличество. Если нету то вписываем его
	// 				//метод Find()  он ищет в экземлерах (AllProducts) определненные элементы (id)
	// 				let find = this.allProducts.find(product => product.id_product === productId);
	// 				//Если он есть то просто добовляем количество
	// 				if (find) {
	// 					find.quantity++;
	// 					//Метод updateCart  вносит изменнения на страницу( в корзину)
	// 					this.updateCart(find);
	// 				} else {
	// 					//Еслиего нет то присваем данные
	// 					let product = {
	// 						id_product: productId,
	// 						price: +element.dataset['price'],
	// 						product_name: element.dataset['name'],
	// 						quantity: 1
	// 					};
	// 					//в массив goods мы помещаем наш один элемент Product
	// 					this.goods = [product];
	// 					// Отоборажаем наш массив
	// 					this.render();
	// 				}
	// 			} else {
	// 				alert('Error');
	// 			}
	// 		})
	// }

	// Удаление добавленного товара
	removeProduct(element) {
		// Делаем запорос на сервер
		this.getJson(`${API_URL}/deleteFromBasket.json`)
			.then(data => {
				if (data.result === 1) {
					let productId = +element.dataset['id'];
					let find = this.allProducts.find(product => product.id_product === productId);
					//Если товара больше 1 то удаляем на 1
					if (find.quantity > 1) {
						find.quantity--;
						this.updateCart(find);
					} else {
						//Если мы хотим удалить товар а он один, то нужно удалить его со странице
						// метод splice 
						this.allProducts.splice(this.allProducts.indexOf(find), 1);
						document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
					}
				} else {
					alert('Error');
				}
			})
	}

	//Добавление колличество и цены
	updateCart(product) {
		//Поулчаем  товар соответствующего переданному 49минут
		let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
		//при удаление или добавление меняем данные 
		block.querySelector('.product-quantity').textContent = `Количество ${product.quantity} шт.`;
		block.querySelector('.product-price').textContent = `${product.quantity * product.price} р.`;
	}

	// кнопка корзины,  удаление товара событие 
	init() {
		// document.querySelector('.btn-property').addEventListener('click', e => {
		// 	document.querySelector(this.container).classList.toggle('hidden');
		// });
		document.querySelector(this.container).addEventListener('click', e => {
			if (e.target.classList.contains('del-btn')) {
				this.removeProduct(e.target);
			}
		})
	}
}

// Элемент корзины  наследуется 
// class CartItem extends Item {
// 	constructor(el, img = 'https://avatarko.ru/img/kartinka/32/Halloween_31492.jpg') {
// 		super(el, img);
// 		//Определяем количесвто поулчаемое из El. количества
// 		this.quantity = el.quantity;
// 	}

// 	render() {
// 		return `<div class="cart-item" data-id="${this.id_product}">
//            		 <div class="product-bio">
//            				 <img src="${this.img}" alt="Some image">
//            				 <div class="product-desc">
//            						 <p class="product-title">${this.product_name}</p>
//           						 <p class="product-quantity">Количество: ${this.quantity} шт.</p>
//      								   <p class="product-single-price">${this.price} p.</p>
//      							</div>
//       				 </div>
//       				 <div class="right-block">	
//           			  <p class="product-price">${this.quantity * this.price} p.</p>
//           			  <button class="del-btn" data-id="${this.id_product}">&times;</button>
//       				 </div>
//       			</div>`
// 	}
// }

const list2 = {
	// Ключ             Ссылка
	ProductsList: ProductItem,
	//Ключ   ССылка(конструктор элемента)
	Cart: CartItem
};

// Новый экземпляр Cart
let cart = new Cart();
//Новый экземпляр ProductList
let products = new ProductsList(cart);
// list.fetchProducts(() => {
// 	list.render();
// 	list.calcSum();
// });
// products.getJson(`getProducts.json`).then(data => products.handleData(data));



