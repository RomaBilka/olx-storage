"use strict";

/**
 * lastElement.
 * @param  {Object} obj - Object.
 */
function lastElement(obj){
    let last = 0
    for(let k in obj){
        const price = parseInt(obj[k]);
        if (!isNaN(price) && price>0){
            last = price;
        }
    }
    return last;
}

/**
 * getJsonFromUrl.
 * @param  {string} url.
 */
function getJsonFromUrl(url = window.location.search) {
    try {
        const query = url.slice(url.indexOf('?') + 1);
        return query.split('&').reduce((acc, curr) => {
            const [key, value] = curr.split('=');
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {});
    } catch (error) {
        console.error(`Error in getJsonFromUrl: ${error.message}`);
        return {};
    }
}

/**
 * getCookie.
 * @param  {string} cname - cookie name.
 */
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function hashCode(str) {
    let hash = 0;
    if(str !== undefined){
        for (let i = 0, len = str.length; i < len; i++) {
            let chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0;
        }
        return Math.abs(hash);
    }
}

class Draw {
    /**
     * constructor.
     * @param  {Object} data - parameters.
     */
    constructor(data = {}) {
        if ("width" in data) this.width = parseInt(data['width']);
        else this.width = 600;
        if ("height" in data) this.height = parseInt(data['height']);
        else this.height = 300;
        if ("mark_X" in data) this.mark_X = data['mark_X'];
        else this.mark_X = 'X';
        if ("mark_Y" in data) this.mark_Y = data['mark_Y'];
        else this.mark_Y = 'Y';
        if ("title" in data) this.title = data['title'];
        else this.title = '';
        if ("border_X_left" in data) this.border_X_left = parseInt(data['border_X_left']);
        else this.border_X_left = 75;
        if ("border_X_right" in data) this.border_X_right = parseInt(data['border_X_right']);
        else this.border_X_right = 75;
        if ("border_Y_top" in data) this.border_Y_top = parseInt(data['border_Y_top']);
        else this.border_Y_top = 55;
        if ("border_Y_bottom" in data) this.border_Y_bottom = parseInt(data['border_Y_bottom']);
        else this.border_Y_bottom = 40;
        if ("color_border" in data) this.color_border = data['color_border'];
        else this.color_border = "rgb(110, 110, 110)";
        if ("color_mark" in data) this.color_mark = data['color_mark'];
        else this.color_mark = '#fff';
        if ("background_color" in data) this.background_color = data['background_color'];
        else this.background_color = '#fff';
        if ("color" in data) this.color = data['default_color'];
        else this.color = '#000';
        if ("font_size_title" in data) this.font_size_title = parseInt(data['font_size_title']);
        else this.font_size_title = '24';
        if ("font_size_mark" in data) this.font_size_mark = parseInt(data['font_size_mark']);
        else this.font_size_mark = '24';
        if ("img_type" in data) this.img_type = data['img_type'];
        else this.img_type = 'img';
    }

    /**
     * parameters.
     * @param  {Object} data - parameters.
     */
    parameters(data = {}) {
        if ("width" in data) this.width = parseInt(data['width']);
        if ("height" in data) this.height = parseInt(data['height']);
        if ("mark_X" in data) this.mark_X = data['mark_X'];
        if ("mark_Y" in data) this.mark_Y = data['mark_Y'];
        if ("title" in data) this.title = data['title'];
        if ("border_X_left" in data) this.border_X_left = parseInt(data['border_X_left']);
        if ("border_X_right" in data) this.border_X_right = parseInt(data['border_X_right']);
        if ("border_Y_top" in data) this.border_Y_top = parseInt(data['border_Y_top']);
        if ("border_Y_bottom" in data) this.border_Y_bottom = parseInt(data['border_Y_bottom']);
        if ("color_border" in data) this.color_border = data['color_border'];
        if ("color_mark" in data) this.color_mark = data['color_mark'];
        if ("background_color" in data) this.background_color = data['background_color'];
        if ("color" in data) this.color = data['default_color'];
        if ("font_size_title" in data) this.font_size_title = parseInt(data['font_size_title']);
        if ("font_size_mark" in data) this.font_size_mark = parseInt(data['font_size_mark']);
        if ("img_type" in data) this.img_type = data['img_type'];
    }

    /**
     * zoomOption - the method calculates the parameters for zooming and displaying data on the graph.
     */
    zoomOption() {
        this.Xe = (this.width - this.border_X_left - this.border_X_right) / (this.max_X - this.min_X);
        this.dX = this.border_X_left - this.min_X * this.Xe;
        this.Ye = (this.height - this.border_Y_top - this.border_Y_bottom) / (this.min_Y - this.max_Y);
        this.dY = this.border_Y_top - this.max_Y * this.Ye;
    }

    /**
     * border - builds a frame around the graphics.
     */
    border() {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.color_border;
        this.ctx.rect(this.border_X_left, this.border_Y_top, (this.width - this.border_X_right - this.border_X_left), (this.height - this.border_Y_bottom - this.border_Y_top));
        this.ctx.stroke();
    }

    /**
     * background.
     */
    background() {
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.width, this.height);
        this.ctx.fillStyle = this.background_color;
        this.ctx.fill();
    }

    /**
     * writeTitle - draw title.
     */
    writeTitle() {
        this.ctx.font = this.font_size_title + 'px Calibri';
        this.ctx.fillStyle = this.color_mark;
        var w = this.ctx.measureText(this.title).width;
        this.ctx.fillText(this.title, (this.width - w) / 2, 25);
        this.ctx.stroke();
    }

    /**
     * mark_X_Y.
     */
    mark_X_Y() {
        this.ctx.font = this.font_size_title + 'px Calibri';
        this.ctx.fillStyle = this.color_mark;
        this.ctx.fillText(this.mark_X, this.width + 5 - this.border_X_right, this.height - this.border_Y_bottom);
        this.ctx.fillText(this.mark_Y, this.border_X_left, this.border_Y_top - 8);
        this.ctx.stroke();
    }

    /**
     * grid_X - builds a grid parallel to the Y axis, displays the value on the X axis.
     * @param  {number} n - the number of dotted lines.
     * @param  {number} flag - 1-outputs lines and values in X, 0-displays only lines, -1-displays only values.
     * @param  {number} r - rounding the values to a certain order.
     * @param  {number} font_size.
     */
    grid_X(n = 10, flag = 0, r = 2, font_size = 20) {
        var x, dx, value;
        this.ctx.lineWidth = 1;
        this.ctx.font = font_size + 'px Calibri';
        x = (this.width - (this.border_X_left + this.border_X_right)) / (n + 1);
        dx = this.border_X_left + x;
        this.ctx.beginPath();
        for (var i = 0; i < n; i++) {
            this.ctx.moveTo(dx, this.height - this.border_Y_bottom);
            this.ctx.lineTo(dx, this.height - this.border_Y_bottom + 5);
            if (flag == 1 || flag == 0) {
                this.ctx.strokeStyle = this.color_border;
                this.ctx.moveTo(dx, this.border_Y_top);
                this.ctx.lineTo(dx, this.height - this.border_Y_bottom);
            }
            if (flag == 1 || flag == -1) {
                this.ctx.fillStyle = this.color_mark;
                value = ((dx - this.dX) / this.Xe).toFixed(r);
                this.ctx.fillText(this.timestamp_to_date(value), dx - this.ctx.measureText(value).width / 2, this.height - this.border_Y_bottom + 20);

            }
            dx += x;
        }

        if (flag == 1 || flag == -1) {
            this.ctx.fillText(this.timestamp_to_date(this.min_X.toFixed(r)), this.border_X_left - this.ctx.measureText(this.min_X.toFixed(r)).width / 2, this.height - this.border_Y_bottom + 20);
            this.ctx.fillText(this.timestamp_to_date(this.max_X.toFixed(r)), this.width - this.border_X_right - this.ctx.measureText(this.max_X.toFixed(r)).width / 2, this.height - this.border_Y_bottom + 20);
        }

        this.ctx.stroke();
    }

    timestamp_to_date(timestamp) {
        var date = new Date(parseInt(timestamp));
        let date_str = date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + '.' + (date.getMonth() * 1 + 1) + '.' + date.getFullYear();
        return date_str;
    }

    /**
     * grid_Y - builds a grid parallel to the X axis, displays the value on the Y axis.
     * @param  {number} n - the number of dotted lines.
     * @param  {number} flag - 1-outputs lines and values in Y, 0-displays only lines, -1-displays only values.
     * @param  {number} r - rounding the values to a certain order.
     * @param  {number} font_size.
     */
    grid_Y(n = 5, flag = 1, r = 2, font_size = 20) {
        var y, dy, value;
        this.ctx.lineWidth = 2;
        this.ctx.font = font_size + 'px Calibri';
        var y = (this.height - (this.border_Y_bottom + this.border_Y_top)) / (n + 1);
        var dy = this.border_Y_top + y;
        this.ctx.beginPath();
        for (var i = 0; i < n; i++) {
            this.ctx.moveTo(this.border_X_left - 5, dy);
            this.ctx.lineTo(this.border_X_left, dy);
            if (flag == 1 || flag == 0) {
                this.ctx.strokeStyle = this.color_border;
                this.ctx.moveTo(this.border_X_left, dy);
                this.ctx.lineTo(this.width - this.border_X_right, dy);
            }
            if (flag == 1 || flag == -1) {
                this.ctx.fillStyle = this.color_mark;
                value = ((dy - this.dY) / this.Ye).toFixed(r);
                this.ctx.fillText(value, this.border_X_left - this.ctx.measureText(value).width - 5, dy + 7);
            }
            dy += y;
        }

        if (flag == 1 || flag == -1) {
            this.ctx.fillText(this.min_Y.toFixed(r), this.border_X_left - this.ctx.measureText(this.min_Y.toFixed(r)).width - 5, this.height - this.border_Y_bottom + 5);
            this.ctx.fillText(this.max_Y.toFixed(r), this.border_X_left - this.ctx.measureText(this.max_Y.toFixed(r)).width - 5, this.border_Y_top + 5);
        }

        this.ctx.stroke();

    }

    /**
     * createCanvas.
     */
    createCanvas(idDiv, idCanvas) {
        var div = document.getElementById(idDiv);
        var oldCanvas = document.getElementById(idCanvas);
        if (oldCanvas) oldCanvas.remove();

        var c = document.createElement('canvas');
        c.setAttribute('class', 'canvas');
        c.setAttribute('width', this.width);
        c.setAttribute('height', this.height);
        if (this.img_type == 'img') c.style.display = 'none';
        c.setAttribute('id', idCanvas);
        div.appendChild(c);
        this.canvas = document.getElementById(idCanvas);
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * createImg.
     */
    createImg(c, data) {
        if (this.img_type == 'canvas') return true;
        var oldimg = document.getElementById('img_' + data['div_id']);
        if (oldimg) oldimg.remove();
        var img = document.createElement('img');
        var div = document.getElementById(data['div_id']);
        img.setAttribute('id', 'img_' + data['div_id']);
        img.setAttribute('style', 'width:100%; height:autho');
        img.setAttribute('data_name_img', data['div_id']);
        img.setAttribute('src', c);
        div.appendChild(img);
    }

    /**
     * initialization.
     */
    initialization(data) {
        this.parameters(data);
        this.createCanvas(data['div_id'], data['div_id'] + '_canvas');
        this.zoomOption();
        if (parseInt(data['background']) == 1) this.background();

        if (data['bordre_flaf'] != 0) this.border();
        if (data['title_flaf'] != 0) this.writeTitle();
        if (data['mark_X_Y_flaf'] != 0) this.mark_X_Y();
        if (data['grid_X'] && data['grid_X'] != 0) {
            let line = 10, flag = 1, round = 2, font_size = 20;
            if (data['grid_X']['line']) line = parseInt(data['grid_X']['line']);
            if (data['grid_X']['flag']) flag = parseInt(data['grid_X']['flag']);
            if (data['grid_X']['round']) round = parseInt(data['grid_X']['round']);
            if (data['grid_X']['font_size']) font_size = parseInt(data['grid_X']['font_size']);
            this.grid_X(line, flag, round, font_size);
        } else if (data['grid_X'] != 0) this.grid_X(10, 1, 2);

        if (data['grid_Y'] && data['grid_Y'] != 0) {
            let line = 10, flag = 1, round = 2, font_size = 20;
            if (data['grid_Y']['line']) line = parseInt(data['grid_Y']['line']);
            if (data['grid_Y']['flag']) flag = parseInt(data['grid_Y']['flag']);
            if (data['grid_Y']['round']) round = parseInt(data['grid_Y']['round']);
            if (data['grid_Y']['font_size']) font_size = parseInt(data['grid_Y']['font_size']);
            this.grid_Y(line, flag, round, font_size);
        } else if (data['grid_Y'] != 0) this.grid_Y(10, 1, 2);

    }

    /**
     * graph.
     */
    graph(arr, data = {}) {
        var min_X = Infinity, max_X = -Infinity, min_Y = Infinity, max_Y = -Infinity, x, x_before, key, i, xe, ye,
            radius, style, start_color, stop_color, first_x = '';

        for (key in arr) {
            for (x in arr[key]) {
                if (first_x === '') first_x = x;
                if (parseFloat(x) < min_X) min_X = parseFloat(x);
                if (parseFloat(x) > max_X) max_X = parseFloat(x);
                if (parseFloat(arr[key][x]) < min_Y) min_Y = parseFloat(arr[key][x]);
                if (parseFloat(arr[key][x]) > max_Y) max_Y = parseFloat(arr[key][x]);
            }
        }

        if (arr[key][first_x] > arr[key][x]) {
            start_color = '#f00';
            stop_color = '#0f0';
        } else if (arr[key][first_x] < arr[key][x]) {
            start_color = '#0f0';
            stop_color = '#f00';
        } else {
            if (data['color'][key]) {
                start_color = data['color'][key];
                stop_color = data['color'][key];
            } else {
                start_color = this.color;
                stop_color = this.color;
            }
        }
        this.max_X = max_X;
        this.max_Y = max_Y * 1.1;
        this.min_X = min_X;
        this.min_Y = min_Y * 0.9;

        this.initialization(data);

        //this.ctx.lineWidth = 3;
        for (key in arr) {

            //якщо є переданий колір в настройках використовуєм його
            if (data['color']) {
                if (data['color'][key]) {
                    this.ctx.strokeStyle = data['color'][key];
                }
            }//берем стандартний колір
            else {
                this.ctx.strokeStyle = this.color;
            }

            this.ctx.beginPath();
            i = 0;
            for (x in arr[key]) {
                this.ctx.fillStyle = data['color'][key];
                xe = parseFloat(x) * this.Xe + this.dX;
                ye = parseFloat(arr[key][x]) * this.Ye + this.dY;
                if (i < 1) {
                    this.ctx.moveTo(xe, ye);
                    this.ctx.fillStyle = start_color;
                    this.ctx.fillText(arr[key][x], xe + 5, ye - 5);
                } else {
                    this.ctx.lineTo(parseFloat(x_before) * this.Xe + this.dX, ye);
                    this.ctx.lineTo(xe, ye);
                }
                i++;
                x_before = x;
            }
            this.ctx.fillStyle = stop_color;
            this.ctx.fillText(arr[key][x], xe + 3, ye + 5);
            this.ctx.stroke();
        }

        var img = this.canvas.toDataURL('image/png', 1);
        this.createImg(img, data);
        return true;
    }
}

// end class Draw


/**
 * productStorage - which stores data in a local repository.
 */
class productStorage {
    /**
     * constructor.
     */
    constructor() {
        let user_id = getCookie('user_id');
        this.user = '';
        if (user_id.length > 0) {
            this.user += '_' + user_id;
        } else {
            let img = document.querySelectorAll('noscript')[0].innerHTML;
            let parser = new DOMParser();
            let htmlDoc = parser.parseFromString(img, 'text/html');
            let src = htmlDoc.querySelectorAll('img')[0].getAttribute('src');
            if (src) {
                let getParam = getJsonFromUrl(src);
                this.user += '_' + getParam.uid;
            }
        }
        this.storageName = 'products' + this.user;

        //delete in the nex version
        ////////////////////////////////////
        const products = this.getProducts();
        const updatedProducts = Object.values(products).reduce((newObj, product) => {
            const id = hashCode(product.url);
            product.product_id = id
            newObj[id] = product;
            return newObj;
        }, {});
        this.saveProducts(updatedProducts);
        ////////////////////////////////////
    }

    /**
     * getProducts - Returns the product object from the local repository.
     */
    getProducts() {
        let products = JSON.parse(localStorage.getItem(this.storageName));
        if (products) return products;
        return {};
    }

    /**
     * addProduct.
     * @param  {Object} product.
     */
    addProduct(product) {
        let products = this.getProducts();
        if (!products[product.product_id]) {
            products[product.product_id] = product;
            products[product.product_id]['price_history'] = {};
            products[product.product_id]['price_history'][Date.now()] = product['price'];
        }
        this.saveProducts(products);
    }

    /**
     * updateProduct.
     * @param  {Object} products.
     * @param  {string} page_type.
     */
    updateProduct(products, page_type) {
        const products_history = this.getProducts();
        for (let k in products_history) {
            products_history[k]['status'] = 0;
        }
        for (let i = 0; i < products.length; i++) {
            let prodict_id = products[i]['product_id']
            if (!products_history[prodict_id] && page_type === 'favorites') {
                products_history[prodict_id] = products[i];
                products_history[prodict_id]['price_history'] = {};
                products_history[prodict_id]['price_history'][Date.now()] = products[i]['price'];
            } else {
                if (products[i]) {
                    if (products_history[prodict_id]) {
                        products_history[prodict_id]['status'] = 1;
                        products_history[prodict_id]['url'] = products[i]['url'];
                        products_history[prodict_id]['title'] = products[i]['title'];
                        if (lastElement(products_history[prodict_id]['price_history']) !== products[i]['price'] && products[i]['price'] !== 0) {
                            products_history[prodict_id]['price_history'][Date.now() - 1] = lastElement(products_history[prodict_id]['price_history']);
                            products_history[prodict_id]['price_history'][Date.now()] = products[i]['price'];
                        }
                        if (products[i]['seller'])
                            products_history[prodict_id]['seller'] = products[i]['seller'];
                        if (products[i]['seller_url'])
                            products_history[prodict_id]['seller_url'] = products[i]['seller_url'];
                    }
                }
            }
        }
        this.saveProducts(products_history);
    }

    /**
     * deleteProduct.
     * @param  {Object} product.
     */
    deleteProduct(product) {
        this.deleteProductById(product.product_id);
    }

    /**
     * deleteProductById.
     * @param  {number} product_id.
     */
    deleteProductById(product_id) {
        let products = this.getProducts();
        delete products[product_id];
        this.saveProducts(products);
    }

    /**
     * saveProducts.
     * @param  {Object} products.
     */
    saveProducts(products) {
        localStorage.setItem(this.storageName, JSON.stringify(products));
    }
}

/**
 * parser - parses and updates the page.
 */
class parser {
    /**
     * constructor.
     */
    constructor() {
        let url = window.location.pathname;
        this.page_type = '';
        if (url === '/uk/' || url === '/') this.page_type = 'general';
        else if (url.search('favorites[/]$') > 0) this.page_type = 'favorites';
        else if (url.search('.html$') > 0) this.page_type = 'product';
        else this.page_type = 'search';
    }

    newProduct() {
        return {
            product_id: '',
            img: '',
            title: '',
            url: '',
            price: 0,
            status: 1,
            seller: '',
            seller_url: ''
        }
    }

    /**
     * listTypeList - determine whether a gallery or a list.
     */
    listTypeList() {
        return !!(document.querySelectorAll('#observedViewTiles').length || document.querySelectorAll('a[data-type="galleryWide"]').length);
    }


    /**
     * buildProductObjectByClick - Parser Product Click to Star START.
     */

    	buildProductObjectByClick(e){
            //перевіряєм список чи галерея
            // if(this.listTypeList()){
            //     switch(this.page_type) {
            //       case 'favorites':  return this.listFavorites(e); break;
            //       case 'search':  return this.listSearch(e); break;
            //       default: return false;
            //     }
            // }else{
                switch(this.page_type) {
                 // case 'general':  return this.galleryGeneralSearch(e); break;
                  case 'favorites':  return this.galleryFavorites(e); break;
               //   case 'search':  return this.galleryGeneralSearch(e); break;
                  case 'product':  return this.parseProductOnProductPage(); break;
                  default: return false;
                }
           // }
        }

    /**
     *parsePage - Pars all goods on page (for updating data) START
     */
    parsePage() {
        // if(this.listTypeList()){
        //     switch(this.page_type) {
        //       case 'favorites':  return this.allProductListFavorites();break;
        //       default: return false;
        //     }
        // }else{
            switch(this.page_type) {
              case 'favorites':  return this.allProductGalleryFavorites(); break;
              case 'product':  return [this.parseProductOnProductPage()]; break;
                default: return false;
            }
        // }

    }

    /**
     * allProductGalleryFavorites.
     */
    allProductGalleryFavorites() {
        let products = [];
        let list = document.querySelectorAll('div[view="grid"]>div');
        for (let i = 0; i < list.length; i++) {
            products[i] = Object.assign({}, this.parseProductOnFavoritesPage(list[i]));//клонуєм обєк інакше буде по силці і всюди буде останнє значення
        }
        return products;
    }

    /**
     * allProductListFavorites.
     */

    /*	allProductListFavorites(){
            let products = [];
            let td = document.querySelectorAll('.offer.brtope9.pding10_0.promoted.observedad');
            for(let i=0; i<td.length; i++){
                products[i] = Object.assign({}, this.parseListFavorites(td[i].getAttribute('data-my-id')));//клонуєм обєк інакше буде по силці і всюди буде останнє значення
            }
            return products;
        }
    */


    /**
     * pageUpdate - update the page with data from the repository, the expired price, data for the graphs ....
     * @param  {Object} products.
     */
    pageUpdate(products) {
        // if(this.listTypeList()){
        //     if(this.page_type == 'favorites') {
        //       this.updateListProduct(products);
        //     }
        // }else{
            switch(this.page_type) {
              case 'favorites': this.updateFavoriteProducts(products);break;
              case 'product':   this.updateProductPage(products);break;
              default: return false;
            }
       // }
    }

    /**
     * updateFavorites - update the gallery.
     * @param  {Object} products.
     */
    updateFavoriteProducts(products) {
        let html_product = '<h2>Не активні оголошення</h2><hr><div view="grid" class="css-1oiyj28">';
        for (let key in products) {
            const product = products[key];
            if (product['status'] === 1) {
                const price_element = document.querySelector('div[data-my-id="' + key + '"] p[data-testid="ad-price"]')
                if (price_element) {
                    if (lastElement(product.price_history) > product.price) {
                        price_element.style.color = 'red';
                    }else if (lastElement(product.price_history) < product.price) {
                        price_element.style.color = '#1bc000';
                    }
                }

                if (Object.keys(product.price_history).length > 1) {
                    document.querySelector('[data-my-id="'+key+'"]').setAttribute("data-history-price", JSON.stringify(product.price_history));
                }
            } else {
                html_product += this.htmlProductHistoryList(product);
            }
        }
        html_product += '</div>'
        document.querySelector('div[data-cy="observed-list"] div').insertAdjacentHTML('afterend', html_product);
    }

    /**
     * updateProduct - update product page.
     * @param  {Object} products.
     */
    updateProductPage(products){
        const product_id = this.getProductIdInProductPage();

        if(!products[product_id]) return false;

        const product = products[product_id];
        if(product['status'] === 1){
            const price_element = document.querySelector('h3')

            if(price_element){
                if(lastElement(product.price_history) > product.price) {
                    price_element.style.color = 'red';
                }else if(lastElement(product.price_history) < product.price){
                    price_element.style.color='#1bc000';
                }
            }

            let id = 'plot_'+product_id;
            let d = document.createElement('div');
            let style = "position: fixed; z-index:1000; width:450px; height:225px; left:10px; bottom:10px";
            d.setAttribute('id', id);
            d.setAttribute('style', style);
            d.setAttribute('onclick', "deletePlotGraphProduct('"+id+"');");
            document.body.appendChild(d);
            draw(JSON.stringify(product.price_history), id);
        }

    }

    /**
     * updateListProduct - We build a list for the products that have disappeared from the favorites
     * @param  {Object} product.
     */
    htmlProductHistoryList(product) {
        const html_product = `
		  <div data-cy="l-card" class='css-1sw7q4x' data-history='${product.product_id}'>
			<div class='css-f9q0mq'>
			  <div type='grid' class='css-1wsfzf2'>
				<a class='css-rc5s2u' href='${product.url}'>
				  <div type='grid' class='css-1ktmmfj'>
					<div type='grid' class='css-1nt66ip'>
					  <div class='css-gl6djm'>
						<img src='${product.img}' style='-webkit-filter: grayscale(100%); filter: grayscale(100%);' class='css-8wsg1m' />
					  </div>
					</div>
					<div class='css-13aawz3'>
					  <div class='css-1av34ht'>
						<div class='css-3xiokn'></div>
					  </div>
					</div>
				  </div>
				</a>
				<div type='grid' class='css-jytsq7'>
				  <a class='css-rc5s2u' href='${product.url}'>
					<div class='css-u2ayx9'>
					  <h6 class='css-40l3sp er34gjf0'>${product.title}</h6>
					</div>
				  </a>
				  <div class='css-odp1qd'>
					<p data-testid='location-date' class='css-veheph er34gjf0'>
					  ${product.seller_url && product.seller ? `<a href='${product.seller_url}'><strong style='font-weight: 900;'>${product.seller}</strong></a>` : ''}
					</p>
					<div color='text-global-secondary' class='css-1kfqt7f'></div>
					<p data-testid='ad-price' class='css-1kyg3b9 er34gjf0'>${lastElement(product.price_history)>0 ? lastElement(product.price_history) : product.price}</p>
				  </div>
				  <span data-testid='adRemoveFromFavorites' class='css-1x8zoa0'>
					<div class='css-1fxp90q'>
					  <div data-testid='tooltip-wrapper' class='css-t0lbh8'></div>
					  <div class='delete-from-history' style='color:green;'>
						<p data-deleteId='${product.product_id}'>Видалити</p>
					  </div>              
					</div>
				  </span>
				</div>
			  </div>
			</div>
		  </div>`;

        return html_product;
    }


    /**
     * deleteProductFromHistoryDom.
     * @param  {number} product_id.
     */
    deleteProductFromHistoryDom(product_id) {
        document.querySelector('[data-history="' + product_id + '"]').remove();
    }

    /**
     * galleryFavorites.
     */

    galleryFavorites(e){
        const product = e.composedPath()[9];
        if(!product) return false;
        return this.parseProductOnFavoritesPage(product);
    }
    /**
     * parseProductOnFavoritesPage.
     */
    parseProductOnFavoritesPage(product_noda) {
        const product = this.newProduct();

        const a = product_noda.querySelectorAll('a');
        if (a.length > 0) {
            product.url = window.location.host + a[0].getAttribute('href').replace(/\?.*/, '') || '';
            const productId = hashCode(product.url);
            product.product_id = productId;
            product_noda.dataset.myId = JSON.stringify(productId);
        }

        const title = product_noda.querySelector('h6');
        if (title) {
            product.title = title.textContent;
        }

        const img = product_noda.querySelector('img');
        if (img) {
            product.img = img.getAttribute('src') || '';
        }

        const price = product_noda.querySelector('p[data-testid="ad-price"]');
        if (price) {
            product.price = this.strInt(price.textContent.replace(/([^\d]*)/, ''));
        }

        return product;
    }

    /**
     * listFavorites.
     */
    /*listFavorites(e){
        let product_id = e.composedPath()[8].getAttribute('data-my-id');
        if(!product_id) return false;
        return this.parseListFavorites(product_id);
    }*/
    /**
     * parseListFavorites.
     * @param  {number} product_id.
     */

    /*parseListFavorites(product_id){
        this.product.product_id = product_id;
        if(document.querySelectorAll('td[data-my-id="'+product_id+'"] img')[0]){
            this.product.img = document.querySelectorAll('td[data-my-id="'+product_id+'"] img')[0].getAttribute('src');
        }
        if(document.querySelectorAll('td[data-my-id="'+product_id+'"] a')[0]){
            this.product.url = document.querySelectorAll('td[data-my-id="'+product_id+'"] a')[0].getAttribute('href');
        }
        if(document.querySelectorAll('td[data-my-id="'+product_id+'"] a')[0]){
            this.product.title = document.querySelectorAll('td[data-my-id="'+product_id+'"] a')[0].getAttribute('title');
        }

        if(document.querySelectorAll('td[data-my-id="'+product_id+'"] p[class="price"]')[0]){
            this.product.price = this.strInt(document.querySelectorAll('td[data-my-id="'+product_id+'"] p[class="price"]')[0].innerHTML.replace(/([^\d]*)/, ''));

        }

        return this.product;
    }*/

    /**
     * getProductIdInProductPage
     */
    getProductIdInProductPage() {
        return hashCode(window.location.host + window.location.pathname );
    }

    /**
     * parseProduct
     */
    parseProductOnProductPage() {
        let product = this.newProduct()
        product.url = window.location.host + window.location.pathname;
        product.product_id = this.getProductIdInProductPage();

        if (document.querySelector('img[data-testid="swiper-image"]')) {
            product.img = document.querySelector('img[data-testid="swiper-image"]').currentSrc;
        }

        const title = document.querySelector('h1')
        if (title){
            product.title = title.textContent.trim();
        }

        if (document.querySelector('h3')) {
            product.price = this.strInt(document.querySelector('h3').textContent.replace(/([^\d]*)/, ''));
        }

        if (document.querySelector('a[data-testid="user-profile-link"]')) {
            product.seller = "Продавець";
            product.seller_url = document.querySelector('a[data-testid="user-profile-link"]').getAttribute('href');
        }

        return product;
    }

    /**
     * strInt.
     * @param  {string} str.
     */
    strInt(str) {
        return parseInt(str.replace(' ', ''));
    }
}


const pars = new parser();
const storage = new productStorage();
const plot = new Draw();

/**
 * draw.
 * @param  {string} history_price.
 * @param  {string} id.
 */
function draw(history_price, id) {
    let price = JSON.parse(history_price);
    price[Date.now()] = lastElement(price);
    var data = {
        'graph_1': price,
    };
    //метод graph
    plot.graph(data,
        {
            'div_id': id, //id div де буде строрено зображення, обовязкове значення
            'mark_X': 'Дата',    //пфдпис осі Х
            'mark_Y': 'Ціна',	//підпос осі У
            'background': '1',	//означає що буде фон (дифолтний колір) по замовчуванню прозоре полотго
            'background_color': 'rgb(0, 0, 0, 0.85)',	//колір фону
            'color': {					//колір графіків (назва ключа має співпадати з назвою ключа в data)
                'graph_1': '#fff'
            },
            'grid_X': {				//параметри сітки по Х
                'line': '2',		//кількість ліній
                'flag': '1',			//прапорець типу ліній (1-лінії і підписи, 0-виводить тільки лінії, -1 -виводить тільки значення)
                'round': '0',		//до якого знаку округлити значення
                'font_size': '18'	//розмір шрифта
            },
            'grid_Y': {				//параметри сітки по У
                'line': '3',
                'flag': '1',			//прапорець типу ліній (1-лінії і підписи, 0-виводить тільки лінії, -1 -виводить тільки значення)
                'round': '1',		//до якого знаку округлити значення
                'font_size': '20'
            },
            'img_type': 'img'	//як буде виводитись зображення (img - тег img, canvas - тег canvas)
        });
}

/**
 * addProduct.
 */


function addProduct(e){
	storage.addProduct(pars.buildProductObjectByClick(e));
}
/**
 * deleteProduct.
 */
function deleteProduct(e) {
    storage.deleteProduct(pars.buildProductObjectByClick(e));
}

/**
 * deleteProductHistory.
 */
function deleteProductFromHistory(e) {
    let product_id = e.composedPath()[0].getAttribute('data-deleteId');
    storage.deleteProductById(product_id);
    pars.deleteProductFromHistoryDom(product_id)
}

/**
 * plotGraph - builds a chart after pointing the mouse on the product on the page selected.
 */
function plotGraph(e) {
    setTimeout(() => {
        const hover = document.querySelectorAll(":hover");
        const target = e.target;
        for (let i = 0; i < hover.length; i++) {
            if (target === hover[i]) {
                const id = 'plot_' + target.getAttribute('data-my-id');
                const div = document.createElement('div');
                const style = "position: fixed; z-index:1000; width:450px; height:225px; left:10px; top:10px";
                div.setAttribute('id', id);
                div.setAttribute('style', style);
                document.body.appendChild(div);
                const historyPrice = target.getAttribute('data-history-price');
                if (historyPrice) {
                    draw(historyPrice, id);
                }
            }
        }
    }, 500);
}

/**
 * deletePlotGraph.
 */
function deletePlotGraph(e) {
    let id = 'plot_' + e.composedPath()[0].getAttribute('data-my-id');
    let div = document.getElementById(id);
    if (div) {
        div.parentNode.removeChild(div);
    }
}

/**
 * deletePlotGraphProduct.
 */
function deletePlotGraphProduct(e) {
    let id = e.composedPath()[0].getAttribute('id');
    let img = document.getElementById(id);
    if (img) {
        img.parentNode.removeChild(img);
    }
}


function setEventListener() {
    const stars = document.querySelectorAll('span[data-icon="star"]');
    for(let i=0; i<stars.length; i++){
        stars[i].addEventListener("click", addProduct);
    }
    const stars_filled = document.querySelectorAll('span[data-testid="adRemoveFromFavorites"], div[class="css-1lx5q7o"]');
    for (let i = 0; i < stars_filled.length; i++) {
        stars_filled[i].addEventListener("click", deleteProduct);
    }

    const history = document.querySelectorAll('div[class="delete-from-history"]');
    for (let i = 0; i < history.length; i++) {
        history[i].addEventListener("click", deleteProductFromHistory);
    }
    const data_history_price = document.querySelectorAll('[data-my-id]');
    for (let i = 0; i < data_history_price.length; i++) {
        data_history_price[i].addEventListener("mouseenter", plotGraph);
        data_history_price[i].addEventListener("mouseleave", deletePlotGraph);
    }
    const data_history_price_product = document.querySelectorAll('[data_name_img]');
    for (let i = 0; i < data_history_price_product.length; i++) {
        data_history_price_product[i].addEventListener("click", deletePlotGraphProduct);
    }
}

/**
 * parsePage.
 */


setTimeout(() => {
    var target = document.querySelector('#listContainer');
    if (target) {
        var observer = new MutationObserver(function (mutations) {
            var reEvent = false;
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList') {
                    reEvent = true;
                }
            });
            if (reEvent) setEventListener();
        });
        var config = {attributes: true, childList: true, characterData: true};
        observer.observe(target, config);
    }

    parsePage();
    setEventListener();

}, 2000);

function parsePage() {
    let products = pars.parsePage();
    if (products) {
        storage.updateProduct(products, pars.page_type);
        pars.pageUpdate(storage.getProducts());
    }
}

/**
 * mutation tracking changes in DOM (change list to gallery or pagination or filters) .
 */
/*
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
}*/
/*
window.onload = starEventListener;
parsePage();
*/