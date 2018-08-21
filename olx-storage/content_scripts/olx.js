function lastElement(obj){
		let last
		for(let k in obj){
			last = obj[k];
		}
		return last;
	}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


// Draw для побудови графіків 
class Draw{
	constructor(data={}) {
		if("width" in data) this.width = parseInt(data['width']);
		else this.width = 600;
		if("height" in data) this.height = parseInt(data['height']);
		else this.height = 300;
		if("mark_X" in data) this.mark_X = data['mark_X'];
		else this.mark_X = 'X';
		if("mark_Y" in data) this.mark_Y  = data['mark_Y'];
		else this.mark_Y  = 'Y';
		if("title" in data) this.title = data['title'];
		else this.title = '';
		if("border_X_left" in data) this.border_X_left = parseInt(data['border_X_left']);
		else this.border_X_left = 75;
		if("border_X_right" in data) this.border_X_right = parseInt(data['border_X_right']);
		else this.border_X_right = 75;
		if("border_Y_top" in data) this.border_Y_top = parseInt(data['border_Y_top']);
		else this.border_Y_top = 55;
		if("border_Y_bottom" in data) this.border_Y_bottom = parseInt(data['border_Y_bottom']);
		else this.border_Y_bottom = 40;
		if("color_border" in data) this.color_border = data['color_border'];
		else this.color_border = "rgb(110, 110, 110)";
		if("color_mark" in data) this.color_mark = data['color_mark'];
		else this.color_mark = '#fff';
		if("background_color" in data) this.background_color = data['background_color'];
		else this.background_color = '#fff';
		if("color" in data) this.color = data['default_color'];
		else this.color = '#000';
		if("font_size_title" in data) this.font_size_title = parseInt(data['font_size_title']);
		else this.font_size_title = '24';
		if("font_size_mark" in data) this.font_size_mark = parseInt(data['font_size_mark']);
		else this.font_size_mark = '24';
		if("img_type" in data) this.img_type = data['img_type'];
		else this.img_type = 'img';
	}
	parameters(data={}) {
		if("width" in data) this.width = parseInt(data['width']);
		if("height" in data) this.height = parseInt(data['height']);
		if("mark_X" in data) this.mark_X = data['mark_X'];
		if("mark_Y" in data) this.mark_Y  = data['mark_Y'];
		if("title" in data) this.title = data['title'];
		if("border_X_left" in data) this.border_X_left = parseInt(data['border_X_left']);
		if("border_X_right" in data) this.border_X_right = parseInt(data['border_X_right']);
		if("border_Y_top" in data) this.border_Y_top = parseInt(data['border_Y_top']);
		if("border_Y_bottom" in data) this.border_Y_bottom = parseInt(data['border_Y_bottom']);
		if("color_border" in data) this.color_border = data['color_border'];
		if("color_mark" in data) this.color_mark = data['color_mark'];
		if("background_color" in data) this.background_color = data['background_color'];
		if("color" in data) this.color = data['default_color'];
		if("font_size_title" in data) this.font_size_title = parseInt(data['font_size_title']);
		if("font_size_mark" in data) this.font_size_mark = parseInt(data['font_size_mark']);
		if("img_type" in data) this.img_type = data['img_type'];
	}
//метод розраховує параметри для маштабування і відображення даних на графіку
zoomOption(){
	this.Xe = (this.width - this.border_X_left -this.border_X_right) / (this.max_X -  this.min_X);
	this.dX = this.border_X_left - this.min_X * this.Xe;
	this.Ye = (this.height - this.border_Y_top - this.border_Y_bottom) / (this.min_Y -  this.max_Y);
	this.dY =  this.border_Y_top - this.max_Y * this.Ye;
}
//відмальовує рамку навкого графіка
border(){
	this.ctx.lineWidth = 2;
	this.ctx.strokeStyle = this.color_border;
	this.ctx.rect(this.border_X_left , this.border_Y_top, (this.width - this.border_X_right-this.border_X_left) , (this.height-this.border_Y_bottom-this.border_Y_top));
	this.ctx.stroke();
}
background(){
	this.ctx.beginPath();
	this.ctx.rect(0, 0, this.width, this.height);
	this.ctx.fillStyle = this.background_color;
	this.ctx.fill();
}
//відмальовує назву графіка
writeTitle(){
	this.ctx.font = this.font_size_title+'px Calibri';
	this.ctx.fillStyle = this.color_mark ;
	var w = this.ctx.measureText(this.title).width;
	this.ctx.fillText(this.title, (this.width-w)/2, 25);
	this.ctx.stroke();
}
//відмальовує підписи координат графіка
mark_X_Y(){
	this.ctx.font = this.font_size_title+'px Calibri';
	this.ctx.fillStyle = this.color_mark ;
	this.ctx.fillText(this.mark_X, this.width+5-this.border_X_right, this.height-this.border_Y_bottom);
	this.ctx.fillText(this.mark_Y, this.border_X_left, this.border_Y_top-8);
	this.ctx.stroke();
}
//відмальовує сітку паралельоно осі Y, виводит значення на осі X
//приймає параметри int $n=4, $flag=1
//$n - кількість пунктирних ліній
//$flag - 1 -виводить лінії і значення по Х, 0-виводить тільки лінії, -1 -виводить тільки значення
//$r округлення значння до певного порядку
 grid_X(n=10, flag=0, r=2, font_size=20){
		var x, dx, value;
		this.ctx.lineWidth = 1;
		this.ctx.font = font_size+'px Calibri';
		x = (this.width - (this.border_X_left + this.border_X_right)) / (n+1);
		dx = this.border_X_left + x;
		this.ctx.beginPath();
		for(var i=0; i<n; i++){
			this.ctx.moveTo(dx, this.height-this.border_Y_bottom);
			this.ctx.lineTo(dx, this.height-this.border_Y_bottom+5);
			if(flag==1 || flag ==0){
				this.ctx.strokeStyle = this.color_border;
				this.ctx.moveTo(dx, this.border_Y_top);
				this.ctx.lineTo(dx, this.height-this.border_Y_bottom);
			}
			if(flag==1 || flag ==-1){
				this.ctx.fillStyle = this.color_mark ;
				value = ((dx - this.dX)/this.Xe).toFixed(r);
				this.ctx.fillText(this.timestamp_to_date(value), dx-this.ctx.measureText(value).width/2, this.height - this.border_Y_bottom+20);
				
			}
			dx+=x;
		}
		
		if(flag==1 || flag ==-1){
			this.ctx.fillText(this.timestamp_to_date(this.min_X.toFixed(r)), this.border_X_left-this.ctx.measureText(this.min_X.toFixed(r)).width/2, this.height - this.border_Y_bottom+20);
			this.ctx.fillText(this.timestamp_to_date(this.max_X.toFixed(r)), this.width-this.border_X_right-this.ctx.measureText(this.max_X.toFixed(r)).width/2, this.height - this.border_Y_bottom+20);
		}
		
		this.ctx.stroke();	
	}
	timestamp_to_date(timestamp){
		var date = new Date(parseInt(timestamp));
		let date_str = date.getHours() + ":" +  date.getMinutes() +" "+ date.getDate()+'.'+date.getMonth()+'.'+date.getFullYear();
		return date_str;
	}
//відмальовує сітку паралельоно осі X, виводит значення на осі Y
	//приймає параметри int $n=4, $flag=1
	//$n - кількість пунктирних ліній
	//$flag - 1 -виводить лінії і значення по Y, 0-виводить тільки лінії, -1 -виводить тільки значення
	//$r округлення значння до певного порядку
	 grid_Y(n=5, flag=1, r=2,font_size=20){
		var y, dy, value; 
		this.ctx.lineWidth = 2;
		this.ctx.font = font_size+'px Calibri';
		var y = (this.height - (this.border_Y_bottom + this.border_Y_top)) / (n+1);
		var dy = this.border_Y_top + y;
		this.ctx.beginPath();
		for(var i=0; i<n; i++){
			this.ctx.moveTo(this.border_X_left-5, dy);
			this.ctx.lineTo(this.border_X_left, dy);
			if(flag==1 || flag ==0){
				this.ctx.strokeStyle = this.color_border;
				this.ctx.moveTo(this.border_X_left, dy);
				this.ctx.lineTo(this.width-this.border_X_right, dy);
			}
			if(flag==1 || flag ==-1){
				this.ctx.fillStyle = this.color_mark ;
				value = ((dy - this.dY) / this.Ye).toFixed(r);
				this.ctx.fillText(value, this.border_X_left - this.ctx.measureText(value).width-5, dy+7);
			}
			dy+=y;
		}
		
		if(flag==1 || flag ==-1){
			this.ctx.fillText(this.min_Y.toFixed(r), this.border_X_left-this.ctx.measureText(this.min_Y.toFixed(r)).width-5, this.height - this.border_Y_bottom+5);
			this.ctx.fillText(this.max_Y.toFixed(r), this.border_X_left-this.ctx.measureText(this.max_Y.toFixed(r)).width-5, this.border_Y_top+5);
		}
		
		this.ctx.stroke();
		
	}	
//Метод створює канву
 createCanvas(idDiv, idCanvas) {
		var div = document.getElementById(idDiv);
		var oldCanvas = document.getElementById(idCanvas);
		if(oldCanvas) oldCanvas.remove();
		
		var c = document.createElement('canvas');
		c.setAttribute('class', 'canvas');
		c.setAttribute('width', this.width);
		c.setAttribute('height', this.height);
		if (this.img_type =='img') c.style.display='none';
		c.setAttribute('id', idCanvas);
		div.appendChild(c);
		this.canvas = document.getElementById(idCanvas);
		this.ctx = this.canvas.getContext('2d');
	}
 createImg(c,data){
	if (this.img_type =='canvas') return true;
	var oldimg = document.getElementById('img_'+data['div_id']);
	if(oldimg) oldimg.remove();
	var img = document.createElement('img');
	var div = document.getElementById(data['div_id']);
		img.setAttribute('id', 'img_'+data['div_id']);
		img.setAttribute('style', 'width:100%; height:autho');
		img.setAttribute('data_name_img', data['div_id']);
		img.setAttribute('src', c);
		div.appendChild(img);
}
	initialization(data){
		this.parameters(data);
		this.createCanvas(data['div_id'], data['div_id']+'_canvas');
		this.zoomOption();
		if(parseInt(data['background'])==1) this.background();
		
		if(data['bordre_flaf'] !=0 )this.border();
		if(data['title_flaf'] !=0 )this.writeTitle();
		if(data['mark_X_Y_flaf'] !=0 )this.mark_X_Y();
		if(data['grid_X'] && data['grid_X']!=0){
			let line=10, flag=1, round=2, font_size=20;
			if(data['grid_X']['line']) line = parseInt(data['grid_X']['line']);
			if(data['grid_X']['flag']) flag = parseInt(data['grid_X']['flag']);
			if(data['grid_X']['round']) round = parseInt(data['grid_X']['round']);
			if(data['grid_X']['font_size']) font_size = parseInt(data['grid_X']['font_size']);
			this.grid_X(line, flag, round, font_size);
		}
		else if(data['grid_X']!=0)this.grid_X(10, 1, 2);

		if(data['grid_Y'] && data['grid_Y']!=0){
			let line=10, flag=1, round=2, font_size=20;
			if(data['grid_Y']['line']) line = parseInt(data['grid_Y']['line']);
			if(data['grid_Y']['flag']) flag = parseInt(data['grid_Y']['flag']);
			if(data['grid_Y']['round']) round = parseInt(data['grid_Y']['round']);
			if(data['grid_Y']['font_size']) font_size = parseInt(data['grid_Y']['font_size']);
			this.grid_Y(line, flag, round, font_size);
		}
		else if(data['grid_Y']!=0) this.grid_Y(10, 1, 2);

	}
	graph(arr, data={}){	
		var min_X = Infinity, max_X = -Infinity, min_Y = Infinity, max_Y = -Infinity, x, x_before, key, i,xe,ye, radius, style,  start_color, stop_color, first_x='';
		
		for(key in arr) {			
			for(x in arr[key]){
				if(first_x==='') first_x = x;
				if ( parseFloat(x) < min_X) min_X = parseFloat(x);
				if ( parseFloat(x) > max_X) max_X = parseFloat(x);
				if ( parseFloat(arr[key][x]) < min_Y) min_Y = parseFloat(arr[key][x]);
				if ( parseFloat(arr[key][x]) > max_Y) max_Y = parseFloat(arr[key][x]);
			}
		}

		if(arr[key][first_x]>arr[key][x]){
			start_color = '#f00';
			stop_color =  '#0f0';
		}else if(arr[key][first_x]<arr[key][x]){
			start_color = '#0f0';
			stop_color =  '#f00';
		}else{
			if(data['color'][key]){
				start_color = data['color'][key];
				stop_color =  data['color'][key];
			}
			else{
				start_color = this.color;
				stop_color = this.color;
			}
		}
		this.max_X = max_X;
		this.max_Y = max_Y*1.1;
		this.min_X = min_X;
		this.min_Y = min_Y*0.9;
		
		this.initialization(data);
		
		//this.ctx.lineWidth = 3;
			for(key in arr) {

				//якщо є переданий колір в настройках використовуєм його
				if(data['color']){
					if(data['color'][key]){
						this.ctx.strokeStyle = data['color'][key];
					}
				}//берем стандартний колір	
				else{
					this.ctx.strokeStyle = this.color;
				}
				
				this.ctx.beginPath();
				i=0;
				for(x in arr[key]){
					this.ctx.fillStyle = data['color'][key];
					xe = parseFloat(x) * this.Xe + this.dX;
					ye = parseFloat(arr[key][x]) * this.Ye + this.dY;			
					if (i<1){
						this.ctx.moveTo(xe,ye);
						this.ctx.fillStyle = start_color;
						this.ctx.fillText(arr[key][x], xe+5, ye-5);
					}
					else{
						this.ctx.lineTo(parseFloat(x_before) * this.Xe + this.dX,ye);
						this.ctx.lineTo(xe,ye);
					}
					i++;
					x_before = x;
				}
				this.ctx.fillStyle = stop_color;
				this.ctx.fillText(arr[key][x], xe+3, ye+5);
				this.ctx.stroke();
			}

		var img = this.canvas.toDataURL('image/png',1);
		this.createImg(img, data);
		return	true;		
	}
	
					
}		
// end class Draw


//клас 	 що зберігає дані в локальному сховищі
class productStorage{
	constructor() {
		let user_id = getCookie('user_id');
		this.user = 'user'+(user_id.length>0)? ('_' + user_id) : '';
		this.storageName = 'products'+this.user;
	}
	getProducts(){
		let products = JSON.parse(localStorage.getItem(this.storageName));
		if(products) return products;
		return {};//вертаю пустий обєкт
	}
	addProduct(product){
		let products = this.getProducts();
		if(!products[product.product_id]){
			products[product.product_id] = product;
			products[product.product_id]['price_history'] = {};
			products[product.product_id]['price_history'][Date.now()] = product['price'];
		} 
		this.saveProducts(products);
	}
	updateProduct(products, page_type){
		let products_history = this.getProducts();
		for(let k in products_history){
			products_history[k]['status']=0;
		}
		for(let i=0; i<products.length; i++){
			if(!products_history[products[i]['product_id']] &&  page_type=='favorites'){
				products_history[products[i]['product_id']] = products[i];
				products_history[products[i]['product_id']]['price_history'] = {};
				products_history[products[i]['product_id']]['price_history'][Date.now()] = products[i]['price'];
			}else{
				products_history[products[i]['product_id']]['status'] = 1;
				if(lastElement(products_history[products[i]['product_id']]['price_history']) != products[i]['price']){
					products_history[products[i]['product_id']]['price_history'][Date.now()] = lastElement(products_history[products[i]['product_id']]['price_history']);
					products_history[products[i]['product_id']]['price_history'][Date.now()] = products[i]['price'];
				}
				if(products[i]['seller'])
					products_history[products[i]['product_id']]['seller'] = products[i]['seller'];
				if(products[i]['seller_url'])
					products_history[products[i]['product_id']]['seller_url'] = products[i]['seller_url'];
			}
		}
		this.saveProducts(products_history);
	}
	deleteProduct(product){
		let products = this.getProducts();
		delete products[product.product_id];
		this.saveProducts(products);
	}
	deleteProductById(product_id){
		let products = this.getProducts();
		delete products[product_id];
		this.saveProducts(products);
	}
	saveProducts(products){
		localStorage.setItem(this.storageName, JSON.stringify(products));
	}
}

//парсить і оновляє сторінки	
class parser{
	constructor(){
			let url = window.location.pathname;
			this.page_type = '';
			if(url=='/uk/' || url=='/') this.page_type='general';
			else if(url.search('favorites[/]$')>0) this.page_type='favorites';
			else if(url.search('.html$')>0) this.page_type='product';
			else this.page_type='search';
			this.product = {
						product_id:'',
						img:'',
						title:'',
						url:'',
						price:0,
						'status':1,
						seller:'',
						seller_url:''
					};		
						
		}
	//визначаєм чи галерея чи список	
	listTypeList(){
		if(document.querySelectorAll('#observedViewTiles').length || document.querySelectorAll('a[data-type="galleryWide"]').length){
			return true;
		}
		return false;
	}

//парсим продукт по кліку на зірку СТАРТ	
	buildProductObjectByClick(e){
		//перевіряєм список чи галерея
		if(this.listTypeList()){
			switch(this.page_type) {
			  case 'favorites':  return this.listFavorites(e); break;
			  case 'search':  return this.listSearch(e); break;
			  default: return false;
			}
		}else{
			switch(this.page_type) {
			  case 'general':  return this.galleryGeneralSearch(e); break;
			  case 'favorites':  return this.galleryFavorites(e); break;
			  case 'search':  return this.galleryGeneralSearch(e); break;
			  case 'product':  return this.parseProduct(); break;
			  default: return false;
			}
		}
	}
//парсим продукт по кліку на зірку СТОП	



//парсим усі товари на сторінці(для оновлення дани) СТАРТ
	parsePage(){
		if(this.listTypeList()){
			switch(this.page_type) {
			  case 'favorites':  return this.allProductListFavorites();break;
			  default: return false;
			}
		}else{
			switch(this.page_type) {
			  case 'favorites':  return this.allProductGalleryFavorites();break;
			  case 'product':  return [this.parseProduct()];break;
				default: return false;
			}
		}
	}

	allProductGalleryFavorites(){
		let products = [];
		let li = document.querySelectorAll('.gallerywide.clr.normal li');
		for(let i=0; i<li.length; i++){
			products[i] = Object.assign({}, this.parseGalleryFavorites(li[i].getAttribute('data-adid')));//клонуєм обєк інакше буде по силці і всюди буде останнє значення
		}
		return products;
	}
	allProductListFavorites(){
		let products = [];
		let td = document.querySelectorAll('.offer.brtope9.pding10_0.promoted.observedad');
		for(let i=0; i<td.length; i++){
			products[i] = Object.assign({}, this.parseListFavorites(td[i].getAttribute('data-adid')));//клонуєм обєк інакше буде по силці і всюди буде останнє значення
		}
		return products;
	}
//парсим усі товари на сторінці(для оновлення дани) СТОП	

//оновляєм сторінку даними з сховища, ціна, що зникло, дані для графіків...
	pageUpdate(products){ 
		if(this.listTypeList()){
			if(this.page_type == 'favorites') {
			  this.updateListProduct(products);
			}
		}else{
			switch(this.page_type) {
			  case 'favorites':   this.updateFavorites(products);break;
			  case 'product':   this.updateProduct(products);break;
			  default: return false;
			}
		}
		
	}
	//оновляєм галерею
	updateFavorites(products){
		let html = document.querySelectorAll('div[id="favoritesGalleryBox"]')[0].innerHTML;
		let html_product ='<hr><ul class="gallerywide clr normal">';
		for(let k in products){
		let product = products[k];
			let product_id = product.product_id;
			if(product['status'] == 1){
				if(lastElement(product.price_history) > product.price){
					if(document.querySelectorAll('li[data-adid="'+product_id+'"] div[class="price"]')[0]){
						this.product.price = document.querySelectorAll('li[data-adid="'+product_id+'"] div[class="price"]')[0].style.color='red';
					}
				}
				else if(lastElement(product.price_history) < product.price){
					if(document.querySelectorAll('li[data-adid="'+product_id+'"] div[class="price"]')[0]){
						this.product.price = document.querySelectorAll('li[data-adid="'+product_id+'"] div[class="price"]')[0].style.color='#1bc000';
					}
				}
				document.querySelectorAll('li[data-adid="'+product_id+'"]')[0].setAttribute("data-history-price", JSON.stringify(product.price_history));
			}else{
				html_product += this.htmlHistoryLi(product);
			}
		}
		html_product += '</ul>'
		document.querySelectorAll('div[id="favoritesGalleryBox"]')[0].innerHTML = html_product + html;
		document.querySelectorAll('div[id="favoritesGalleryBox"]')[0].classList.remove("hidden");	
	}
	
	//оновляєм сторінку продукта
	updateProduct(products){
		let product_id = parseInt(document.querySelectorAll('div[id="offerdescription"] a')[0].getAttribute('class').substr(4, 25));
		if(!products[product_id]) return false;
		let product = products[product_id];
		if(product['status'] == 1){
			if(lastElement(product.price_history) > product.price){		
				this.product.price = document.querySelectorAll('div[class="price-label"]')[0].style.color='red';
			}
			else if(lastElement(product.price_history) < product.price){
				this.product.price = document.querySelectorAll('div[class="price-label"]')[0].style.color='#1bc000';
			}
			let id = 'plot_'+product_id;
			let d = document.createElement('div');
			let style = "position: fixed; z-index:1000; width:450px; height:225px; left:10px; bottom:10px";
			d.setAttribute('id', id);
			d.setAttribute('style', style);
			document.body .appendChild(d);				
			draw(JSON.stringify(product.price_history), id);
		}
		
	}
	//оновляєм список
	updateListProduct(products){
		let html = document.querySelectorAll('div[id="favoritesGalleryBox"]')[0].innerHTML;
		let html_product ='<hr><ul class="gallerywide clr normal">';
		for(let k in products){
		let product = products[k];
			let product_id = product.product_id;
			if(product['status'] == 1){
				if(lastElement(product.price_history) > product.price){
					if(document.querySelectorAll('td[data-adid="'+product_id+'"]')[0]){
						this.product.price = document.querySelectorAll('td[data-adid="'+product_id+'"]')[0].style.color='red';
					}
				}
				else if(lastElement(product.price_history) < product.price){
					if(document.querySelectorAll('td[data-adid="'+product_id+'"]')[0]){
						this.product.price = document.querySelectorAll('td[data-adid="'+product_id+'"]')[0].style.color='#1bc000';
					}
				}
				document.querySelectorAll('td[data-adid="'+product_id+'"]')[0].setAttribute("data-history-price", JSON.stringify(product.price_history));
			}else{
				html_product += this.htmlHistoryLi(product);
			}
		}
		html_product += '</ul>'
		document.querySelectorAll('div[id="favoritesGalleryBox"]')[0].innerHTML = html_product + html;
		document.querySelectorAll('div[id="favoritesGalleryBox"]')[0].classList.remove("hidden");
		
	}
	
	//будуємо список для товарів що зникли з обраних
	htmlHistoryLi(product){
		let html_product = '';
		html_product +='   <li class="tleft rel fleft observedad promoted" data-history="'+product.product_id+'" style="height:210px">';
		html_product +='		<div class="mheight tcenter">';
		html_product +='			<a class="thumb tdnone scale1 rel offerLink " href="'+product.url+'">';
		html_product +='				 <img class="fleft" src="'+product.img+'" style="-webkit-filter: grayscale(100%); filter: grayscale(100%);">';
		html_product +='			</a>';
		html_product +='		</div>';
		html_product +='       <div class="inner">';
		html_product +='		<h4 class="normal">';
		html_product +='			<a class="link offerLink"  href="'+product.url+'">';
		html_product +='				<strong>'+product.title+'</strong>';
		html_product +='			</a>';
		html_product +='		</h4>';
		if(product.seller_url && product.seller){
			html_product +='		<h4 class="normal">';
			html_product +='			<a class="link offerLink"  href="'+product.seller_url+'">';
			html_product +='				<strong style="color:green; font-weight: 2000;">'+product.seller+'</strong>';
			html_product +='			</a>';
			html_product +='		</h4>';
		}
		html_product +='        </div>';
		html_product +='        <div class="price">'+lastElement(product.price_history)+'</div>';
		html_product +='		<div class="favtab br3 abs zi4 observelinkgallery">';
		html_product +='			<a href="#" class="inlblk lheight16 tdnone removeObservedAd">';
		html_product +='				<span data-history="'+product.product_id+'"  class="icon inlblk observe2 vtop selected" data-icon="star-filled" style="color:green;"></span>';
		html_product +='			</a>';
		html_product +='			<div class="suggesttitle small top abs zi2 br4 hidden">';
		html_product +='				<p>Видалити</p>';
		html_product +='				<div class="target abs icon"></div>';
		html_product +='			</div>';
		html_product +='		</div>';
		html_product +='    </li>';
		return html_product;
	}

//deleteProductHistory СТАРТ
	deleteProductHistory(e){
		let product_id = e.path[0].getAttribute('data-history');
		this.deleteHistoryDomElement(product_id);
		return product_id;
	}
	deleteHistoryDomElement(product_id){
		document.querySelector('[data-history="'+product_id+'"]').remove();
	}
//deleteProductHistory СТОП

		
//парсим сторінку пошуку галерея СТАРТ
	galleryGeneralSearch(e){
		let product_id = e.path[3].getAttribute('data-id');
		if(!product_id) return false;
		return this.parseGalleryGeneralSearch(product_id);
	}
	parseGalleryGeneralSearch(product_id){
		let a = document.querySelectorAll('li[data-id="'+product_id+'"] a');
		this.product.product_id = product_id;
		
		if(document.querySelectorAll('li[data-id="'+product_id+'"] img')[0]){
			this.product.img = document.querySelectorAll('li[data-id="'+product_id+'"] img')[0].getAttribute('src');
		}
	
		if(a[0]){
			this.product.title = a[0].getAttribute('title');
			this.product.url = a[0].getAttribute('href');	
		}
		
		if(document.querySelectorAll('li[data-id="'+product_id+'"] div[class="price "]')[0]){
			this.product.price = this.strInt(document.querySelectorAll('li[data-id="'+product_id+'"] div[class="price "]')[0].innerHTML);
		}else if(document.querySelectorAll('li[data-id="'+product_id+'"] div[class="price price-arranged"]')[0]){
			this.product.price = this.strInt(document.querySelectorAll('li[data-id="'+product_id+'"] div[class="price price-arranged"]')[0].innerHTML);
		}
		return this.product;
	}
//парсим сторінку пошуку галерея СТОП

//парсим сторінку пошуку список СТАРТ	
	listSearch(e){
		let product_id = e.path[7].getAttribute('data-id');
		if(!product_id) return false;
		return this.parseListSearch(product_id);	
	}
	parseListSearch(product_id){
		this.product.product_id = product_id;
		
		if(document.querySelectorAll('table[data-id="'+product_id+'"] img')[0]){
			this.product.img = document.querySelectorAll('table[data-id="'+product_id+'"] img')[0].getAttribute('src');
		}

		if(document.querySelectorAll('table[data-id="'+product_id+'"] a')[0]){
			this.product.url = document.querySelectorAll('table[data-id="'+product_id+'"] a')[0].getAttribute('href');	
		}
		if(document.querySelectorAll('table[data-id="'+product_id+'"] a strong')[0]){
			this.product.title = document.querySelectorAll('table[data-id="'+product_id+'"] a strong')[0].innerHTML;	
		}

		if(document.querySelectorAll('table[data-id="'+product_id+'"] p[class="price"] strong')[0]){
			this.product.price = this.strInt(document.querySelectorAll('table[data-id="'+product_id+'"] p[class="price"] strong')[0].innerHTML);
		}
		return this.product;
	}
//парсим сторінку пошуку список СТОП	

//парсим сторінку фаворитів галерея СТАРТ
	galleryFavorites(e){
		let product_id = e.path[3].getAttribute('data-adid');
		if(!product_id) return false;
		return this.parseGalleryFavorites(product_id);
	}
	parseGalleryFavorites(product_id){
		this.product.product_id = product_id;	
		let a = document.querySelectorAll('li[data-adid="'+product_id+'"] a');
		if(a[0]){
			this.product.title = a[0].getAttribute('title');
			this.product.url = a[0].getAttribute('href');	
		}
		if(document.querySelectorAll('li[data-adid="'+product_id+'"] img')[0]){
			this.product.img = document.querySelectorAll('li[data-adid="'+product_id+'"] img')[0].getAttribute('src');
		}	
		if(document.querySelectorAll('li[data-adid="'+product_id+'"] div[class="price"]')[0]){
			this.product.price = this.strInt(document.querySelectorAll('li[data-adid="'+product_id+'"] div[class="price"]')[0].innerHTML.replace(/([^\d]*)/, ''));
		}
		return this.product;
	}
//парсим сторінку фаворитів галерея СТАРТ
		
//парсим сторінку фаворитів список СТАРТ	
	listFavorites(e){
		let product_id = e.path[8].getAttribute('data-adid');
		if(!product_id) return false;
		return this.parseListFavorites(product_id);
	}
	parseListFavorites(product_id){
		this.product.product_id = product_id;
		if(document.querySelectorAll('td[data-adid="'+product_id+'"] img')[0]){
			this.product.img = document.querySelectorAll('td[data-adid="'+product_id+'"] img')[0].getAttribute('src');
		}
		if(document.querySelectorAll('td[data-adid="'+product_id+'"] a')[0]){
			this.product.url = document.querySelectorAll('td[data-adid="'+product_id+'"] a')[0].getAttribute('href');	
		}
		if(document.querySelectorAll('td[data-adid="'+product_id+'"] a')[0]){
			this.product.title = document.querySelectorAll('td[data-adid="'+product_id+'"] a')[0].getAttribute('title');	
		}
		if(document.querySelectorAll('td[data-adid="'+product_id+'"] p[class="price "]')[0]){
			this.product.price = this.strInt(document.querySelectorAll('td[data-adid="'+product_id+'"] p[class="price "]')[0].innerHTML.replace(/([^\d]*)/, ''));
		}
		
		return this.product;
	}
//парсим сторінку фаворитів список СТАРТ
//парсим сторінку продукту СТАРТ
	parseProduct(){
		let product_id = parseInt(document.querySelectorAll('div[id="offerdescription"] a')[0].getAttribute('class').substr(4, 25));
		if(!product_id) return false;
		this.product.product_id = product_id;
		if(document.querySelectorAll('#photo-gallery-opener img')[0]){
			this.product.img = document.querySelectorAll('#photo-gallery-opener img')[0].getAttribute('src');
		}
		if(document.querySelectorAll('#photo-gallery-opener img')[0]){
			this.product.title = document.querySelectorAll('h1')[0].innerHTML.trim();
		}
		if(document.querySelectorAll('strong[class="xxxx-large not-arranged"]')[0]){
			this.product.price = this.strInt(document.querySelectorAll('strong[class="xxxx-large not-arranged"]')[0].innerHTML);
		}else if(document.querySelectorAll('strong[class="xxxx-large arranged"]')[0]){
			this.product.price = this.strInt(document.querySelectorAll('strong[class="xxxx-large arranged"]')[0].innerHTML);
		}
		
		if(document.querySelectorAll('h4 a')[0]){
			this.product.seller = document.querySelectorAll('h4 a')[0].innerHTML.replace(/([^\a-zA-ZА-Яа-я0-9]*)/, '');	
			this.product.seller_url = document.querySelectorAll('h4 a')[0].getAttribute('href');
		}
		this.product.url = window.location.host + window.location.pathname;
		return this.product;
	}
//парсим сторінку продукту СТОП


//перетворюєм ціну в число
	strInt(str){
		return parseInt(str.replace(' ', ''));
	}
}



const pars = new parser();
const storage = new productStorage();
const plot = new Draw();
function draw(history_price,id){
	let price = JSON.parse(history_price);
	price[Date.now()] = lastElement(price);
	var data={
		'graph_1':price,
	};
	//метод graph
	plot.graph(data, 
		{
			'div_id':id, //id div де буде строрено зображення, обовязкове значення
			'mark_X':'Дата',    //пфдпис осі Х
			'mark_Y':'Ціна',	//підпос осі У
			'background':'1',	//означає що буде фон (дифолтний колір) по замовчуванню прозоре полотго
			'background_color':'rgb(0, 0, 0, 0.85)',	//колір фону
			'color':{					//колір графіків (назва ключа має співпадати з назвою ключа в data)
				'graph_1':'#fff'
			},
			'grid_X':{				//параметри сітки по Х
				'line':'2',		//кількість ліній
				'flag':'1',			//прапорець типу ліній (1-лінії і підписи, 0-виводить тільки лінії, -1 -виводить тільки значення)
				'round':'0',		//до якого знаку округлити значення
				'font_size':'18'	//розмір шрифта
			},
			'grid_Y':{				//параметри сітки по У
				'line':'3',
				'flag':'1',			//прапорець типу ліній (1-лінії і підписи, 0-виводить тільки лінії, -1 -виводить тільки значення)
				'round':'1',		//до якого знаку округлити значення
				'font_size':'20'
			},
			'img_type':'img'	//як буде виводитись зображення (img - тег img, canvas - тег canvas)
		});
}
//дотати товар
function addProduct(e){
	storage.addProduct(pars.buildProductObjectByClick(e));
}
function deleteProduct(e){
	storage.deleteProduct(pars.buildProductObjectByClick(e));
}
//видалити товар з історії
function deleteProductHistory(e){
	storage.deleteProductById(pars.deleteProductHistory(e));
}

//відмальовує графік пісдя наведеня мишки на това на сторінці обраних
function plotGraph(e){
	setTimeout(()=>{
		let hover = document.querySelectorAll( ":hover" );
		for(let i=0; i<hover.length; i++){
			if( e.path[0] == hover[i] ){
				let id = 'plot_'+e.path[0].getAttribute('data-adid');
				let d = document.createElement('div');
				let style = "position: fixed; z-index:1000; width:450px; height:225px; left:10px; top:10px";
				d.setAttribute('id', id);
				d.setAttribute('style', style);
				document.body .appendChild(d);				
				draw(e.path[0].getAttribute('data-history-price'), id);
			} 
		}
	},500);
}
//видаляє графік
function deletePlotGraph(e){
	let id = 'plot_'+e.path[0].getAttribute('data-adid');
	let div = document.getElementById(id);
	if(div){
		div.parentNode.removeChild(div);
	}
}



function starEventListener(){
	
	var stars = document.querySelectorAll('span[data-icon="star"]');
	for(let i=0; i<stars.length; i++){
		stars[i].addEventListener("click", addProduct);
	}
	var stars_filled = document.querySelectorAll('span[data-icon="star-filled"]');
	for(let i=0; i<stars_filled.length; i++){
		stars_filled[i].addEventListener("click", deleteProduct);
	}
	
	var stars_history = document.querySelectorAll('span[data-history]');
	for(let i=0; i<stars_history.length; i++){
		stars_history[i].addEventListener("click", deleteProductHistory);
	}
	var data_history_price = document.querySelectorAll('[data-adid]'); 
		for(let i=0; i<data_history_price.length; i++){
			data_history_price[i].addEventListener("mouseenter", plotGraph);
			data_history_price[i].addEventListener("mouseleave", deletePlotGraph);
		}
		
}
function parsePage(){
	let products = pars.parsePage();
	if(products){
		storage.updateProduct(products, pars.page_type);
		pars.pageUpdate(storage.getProducts());
	}
	
}


//мутація відстежуєм зміни в DOM (зміна списку на галерею чи пагінація або фільтри)
var target = document.querySelector('#listContainer');
if(target){
	var observer = new MutationObserver(function(mutations) {
	var reEvent = false;
	  mutations.forEach(function(mutation) {
		if(mutation.type=='childList'){
			reEvent = true;
		}
	  });
		if(reEvent) starEventListener();
	});
	var config = { attributes: true, childList: true, characterData: true };
	observer.observe(target,  config);
}

window.onload = starEventListener;
parsePage();




