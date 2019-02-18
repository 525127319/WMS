<template>
    <div class="bg" >
         <qriously :value="qrcodeContent" :size="qrcodeSize" />
         <span style="position:absolute;left:83px;top:260px;font-size:28px;font-weight:bold">{{this.qrcodeContent}}</span>
         <!-- <p style="text-align:center;"><span style="font-size:28px" >{{this.qrcodeContent}}</span></p> -->
    </div>
</template>
<script>
import commonUtil from "../../common/commonUtil.js";
export default {
  data() {
    return {
        qrcodeContent: "", //二维码内容
        qrcodeSize:200,
        // background :字符串，二维码背景。默认'white'。
        // backgroundAlpha :数字，二维码背景透明度。默认1.0。
        // foreground :字符串，二维码前景色。默认'black'。
        // foregroundAlpha: :数字，二维码前景色透明度。默认1.0。
        // level: :字符串，，二维码误差校正等级（L,M,Q,H）。默认'L'。
        // mime: :字符串，，二维码图片的mine type。
        // padding: :数字，，二维码padding值（像素）。默认null(auto).
        // size: :数字，，二维码大小（像素）。默认100。
        // value: 字符串，二维码内容。
    };
  },
  created() {
    this.print();

  },

  methods: {
    print() {
      let _this = this;
      this.qrcodeContent = commonUtil.utf16to8(this.$route.query.barCode);
      let type = '/'+this.$route.query.type;
      // if(type == 'repertory'){
        setTimeout(function(){
          window.print();
          _this.$router.push({path:type});
        },50);      
      // }else if(type == 'region'){
      //   setTimeout(function(){
      //     window.print();
      //     _this.$router.push({path:'/region'});
      //   },50);
      // }
    },
    utf16to8(str) {  
        var out, i, len, c;    
        out = "";    
        len = str.length;    
        for(i = 0; i < len; i++) {    
        c = str.charCodeAt(i);    
        if ((c >= 0x0001) && (c <= 0x007F)) {    
            out += str.charAt(i);    
        } else if (c > 0x07FF) {    
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));    
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));    
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));    
        } else {    
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));    
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));    
        }    
        }    
        return out;    
    } 
  }
};
</script>
<style>

 /* .lt canvas{
     display: block;
     margin:10px  auto;
     transform: translateX(-30%);
 } */

.bg canvas {
    display: block;
    margin: 50px auto;
    transform: translateX(-6px);
}

</style>