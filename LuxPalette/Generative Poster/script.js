const app = new Vue({
  el: '#app',
  data: {
    steps: 800,
    colors:  ['#72ffd7','#8af4cd','#9ce9c3','#aaddb9','#b6d2af','#c1c6a5','#cabb9c','#d1af92','#d8a289','#dd9580','#e28877','#e67a6e','#ea6b65','#ed5b5c','#ef4754','#e93950','#da3551','#cc3051','#bd2c52','#af2852','#a12452','#932152','#841d52','#761a52','#681652','#5a1452','#4b1151','#3b0e51','#290d51','#0f0b50'],
    seed: 3.1,
    noise: new SimplexNoise(3.13),
    noisePos: 5.8,
    gradientStopPos: 3,
    gradientStartPos: 1,
    gradientOffset: 1.1,
    blendMode: 'normal',
    bg: 29,
    cos: 3.1,
    cosStart: 6,
    radius: .09,
    radiusVariation: .41,
    animate: false,
  },
  mounted () {
    this.$canvas = document.createElement('canvas');
    this.ctx = this.$canvas.getContext('2d');
    
    this.w = window.innerHeight * .7;
    this.h = window.innerHeight;
    
    this.$canvas.width = this.w;
    this.$canvas.height = this.h;
    
    this.$refs.wrap.appendChild(this.$canvas);
    this.draw();
    this.buildGui();
    
    this.anim();
  },
  computed: {
    scale: function(){
      return chroma.scale(this.colors);
    },
  },
  methods: {
    anim: function () {
      // keep `this` bound when requested by the browser
      requestAnimationFrame(this.anim.bind(this));
      if ( !this.animate ) return;
      this.noisePos += 0.001;
      this.cosStart += .05;
      this.resetCTX();
    },
    resetCTX: function() {
      this.ctx.clearRect(0,0,this.w,this.h)
      this.draw();
    },
    buildGui: function() {
      this.gui = new dat.GUI();
      this.guiSteps = this.gui.add(this, 'steps', 5, 1400);

      this.guiSteps.onChange((value) => {
        this.steps = value;
        this.resetCTX();
      });
      
      this.guiNoise = this.gui.add(this, 'seed', 0, 10);

      this.guiNoise.onFinishChange((value) => {
        this.noise = new SimplexNoise(value);
        this.resetCTX();
      });
      
      
      this.guiNoisePos = this.gui.add(this, 'noisePos', 0, 10);

      this.guiNoisePos.onChange((value) => {
        this.noisePos = value;
        this.resetCTX();
      });
      
      
      
      this.guiCos = this.gui.add(this, 'cos', .5 ,9);

      this.guiCos.onChange((value) => {
        this.cos = value;
        this.resetCTX();
      });
      
      
      this.guiCosStart = this.gui.add(this, 'cosStart', .5 ,9);

      this.guiCosStart.onChange((value) => {
        this.cosStart = value;
        this.resetCTX();
      });
      
      this.guiRadius = this.gui.add(this, 'radius', .001 ,.5);

      this.guiRadius.onChange((value) => {
        this.radius = value;
        this.resetCTX();
      });
      
      this.guiRadiusVaration = this.gui.add(this, 'radiusVariation', .001 ,.5);

      this.guiRadiusVaration.onChange((value) => {
        this.radiusVariation = value;
        this.resetCTX();
      });
      
      this.guiGradientStopPost = this.gui.add(this, 'gradientStopPos', .1 ,3);

      this.guiGradientStopPost.onChange((value) => {
        this.gradientStopPos = value;
        this.resetCTX();
      });
      
      this.guiGradientStartPos = this.gui.add(this, 'gradientStartPos', .1 ,3);

      this.guiGradientStartPos.onChange((value) => {
        this.gradientStartPos = value;
        this.resetCTX();
      });
      
      this.guiGradientOffset = this.gui.add(this, 'gradientOffset', .1 ,3);

      this.guiGradientOffset.onChange((value) => {
        this.gradientOffset = value;
        this.resetCTX();
      });
      
      this.guiBlendMode = this.gui.add(this, 'blendMode', ['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light','difference','exclusion','hue','saturation','color','luminosity']);

      this.guiBlendMode.onChange((value) => {
        this.blendMode = value;
        this.resetCTX();
      });
      
      this.guiBG = this.gui.add(this, 'bg', 0, this.colors.length - 1);

      this.guiBG.onChange((value) => {
        this.bg = parseInt(value);
        this.resetCTX();
      });
      
      this.guiReverse = this.gui.add(this, 'animate');

      this.guiReverse.onChange((value) => {
        this.animate = value;
        this.resetCTX();
      });
      
    },
    draw: function () {
      this.ctx.globalCompositeOperation = this.blendMode;
      
      this.ctx.fillStyle = this.colors[this.bg];
      this.ctx.fillRect(0, 0, this.w,this.h);
      
      for(let i = 0; i < this.steps; i++) {
        this.ctx.save();
        let x = (this.w * .5) + (this.w * .3) * Math.cos(this.cosStart + (2 * Math.PI) * i * this.cos / this.steps); 
        let y = (this.h * .05) + (this.h * (i / this.steps)) * .8;
        this.ctx.translate(
          x, y
          //(this.h * .5) + (this.w * .25) * Math.sin((2 * Math.PI) * i / this.steps)
        );
        
        this.ctx.fillStyle = this.scale(i/this.steps).hex();
        
        let radius = Math.max(1, Math.abs((this.w * this.radius) + this.noise.noise2D(this.noisePos, i / this.steps) * this.w * this.radiusVariation));
        
        let grd = this.ctx.createLinearGradient(0, 0, radius * this.gradientStartPos, radius * this.gradientStopPos);
        
        grd.addColorStop(0, this.scale(i/this.steps).hex());
        //grd.addColorStop(.5, this.scale(Math.abs(i - ((this.steps - i) * .65))/this.steps).hex());
        grd.addColorStop(1, this.scale(Math.abs(i - ((this.steps - i) * this.gradientOffset))/this.steps).hex());
        
        this.ctx.fillStyle = grd;
        this.ctx.beginPath();
        
        this.ctx.arc(
          this.noise.noise2D(i / this.steps, this.noisePos) * 75, 
          this.noise.noise2D(this.noisePos, i / this.steps) * 150, 
          radius,
          0, 
          2 * Math.PI
        );
        
        this.ctx.closePath();

        this.ctx.fill();

        this.ctx.restore();
      }
      //this.addGrain()
    },
    addGrain: function () {
      const $canvas = document.createElement('canvas');
      const ctx = $canvas.getContext('2d');
      $canvas.width = this.w;
      $canvas.height = this.h;
      const image = ctx.createImageData(this.w, this.h);
      const data = image.data;
      const noise = new SimplexNoise();
      
      for (let x = 0; x < this.w; x++) {
        for (let y = 0; y < this.h; y++) {
          let value = noise.noise2D(x / 4, y / 4);
          let cell = (x + y * this.w) * 4;
          data[cell] = data[cell + 1] = data[cell + 2] = Math.floor(value * 256);
          data[cell + 3] = Math.floor(value * 256); // alpha
        }
      }
      
      createImageBitmap(image).then(imgBitmap => {
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.drawImage(imgBitmap,0,0);
        this.ctx.globalCompositeOperation = 'normal';
      });
    },
  }
});

