app.component("Product", {
  template: /* vue-html */`
  <section class="product">
  <div class="product__thumbnails">
    <div
      class="thumb"
      :class="{ active: activeImage === index }"
      :style="{ backgroundImage: 'url(' + product.images[index].thumbnail +')' }"
      v-for="(image, index) in product.images" 
      :key="image.thumbnail"
      @click="activeImage = index"
      ></div>
    </div>
    <div class="product__image">
      <img :src="product.images[activeImage].image" :alt="product.name">
    </div>
  </section>

  <section class="description">
    <h4>{{ product.name.toUpperCase() }} {{ product.stock === 0 ? "😔" : "😎" }}</h4>
    <Badge :product="product"/>
    <p class="description__status" v-if="product.stock === 3">Quedan pocas unidades!</p>
    <p class="description__status" v-else-if="product.stock === 2">El producto esta por terminarse</p>
    <p class="description__status" v-else-if="product.stock === 1">Ultima unidad disponible!</p>
    <p class="description__status" v-else>Sin stock!</p>
    <p class="description__price" :style="{ color: price_color }">{{ new Intl.NumberFormat("es-PE").format(product.price) }} </p>
    <p class="description__content">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium quasi pariatur, eveniet necessitatibus, et unde explicabo dolore natus mollitia dolores aspernatur eligendi esse repudiandae dolorum ex ab accusamus consectetur fugiat.
    </p>
    <div class="discount">
      <span>Código de descuento</span>
      <input type="text" placeholder="Ingresa tu Código" @keyup.enter="applyDiscount($event)"/>
    </div>
    <button :disabled="product.stock === 0" @click="sendToCart()">{{ product.stock > 0 ? "Añadir a Carrito" : "Agotado" }}</button>
  </section>
  `,
  props: [
    "product"
  ],
  emits: [
    "sendtocart"
  ],
  setup(props, context){
    const productState = reactive({
      activeImage: 0,
      price_color: "rgb()104, 104, 209"
    });

    function sendToCart(){
      context.emit("sendtocart", props.product)
    }

    const discountCodes = ref(["NEWYEAR2022", "ELINE2022"]);

        function applyDiscount(event){
          const discountCodeIndex = discountCodes.value.indexOf(event.target.value);
          if (discountCodeIndex >= 0 ) {
            props.product.price *= 50 / 100;
            discountCodes.value.splice(discountCodeIndex, 1);
          }
        }

    watch(
      () => productState.activeImage,
      (val, oldVal) => {
      console.log(val, oldVal);
      }
    );

    watch(
      () => props.product.stock,
      (stock) => {
        if ( stock <=1 ) {
          productState.price_color = "rgb(188, 30, 67)"
        }
      }
      );

    return {
      ...toRefs(productState),
      applyDiscount,
      sendToCart
    }
  }
});