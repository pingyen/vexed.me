<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" >
<meta charset="UTF-8" >
<title>Vexed.Me</title>
<!--[if lt IE 9]>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv-printshiv.min.js" ></script>
<![endif]-->
<link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.2/normalize.min.css" rel="stylesheet" >
<style>
    body {
        background: #FFD356;
    }

    body > p {
        display: inline-block;
        margin: 0;
    }

    body > p > img {
        width: 100%;
        max-width: 414px;
    }

    body > ul {
        display: inline-block;
        vertical-align: bottom;
        margin: 0;
    }

    body > ul > li > a {
        color: #000;
        display: block;
        margin: 7px 0;
        font-family: "Times New Roman";
        letter-spacing: 2px;
        text-decoration: none;
    }

    body > ul > li > a:first-letter {
        font-size: 40px;
        font-weight: bold;
        vertical-align: -4px;
    }

    body > ul > li > a:hover {
        color: #A00;
    }

    @media only screen and (min-device-width: 640px) and (max-device-width: 800px) {
        body > p > img {
            max-width: 282px;
        }
    }

    @media only screen and (max-device-width: 736px) {
        body {
            padding-bottom: 18px;
        }

        body > ul > li > a:first-letter {
            font-size: 24px;
            vertical-align: -1px;
        }
    }
</style>
</head>
<body>
<p><img></p>
<ul>
    <li><a href="https://vexed.me/realtime" target="_blank" >Taiwan Real-time News</a></li>
    <li><a href="https://vexed.me/daily" target="_blank" >Taiwan Daily News</a></li>
    <li><a href="https://vexed.me/tool" target="_blank" >Tools</a></li>
    <li><a href="https://vexed.me/food" target="_blank" >Food</a></li>
</ul>
<ul>
    <li><a href="https://www.facebook.com/pingyen.tsai" target="_blank" >Facebook</a></li>
    <li><a href="https://www.linkedin.com/in/pingyen" target="_blank" >LinkedIn</a></li>
    <li><a href="https://github.com/pingyen" target="_blank" >GitHub</a></li>
    <li><a href="https://gist.github.com/pingyen" target="_blank" >Gist</a></li>
    <li><a href="https://www.instagram.com/vexed/" target="_blank" >Instagram</a></li>
    <li><a href="https://www.facebook.com/groups/p.vexed" target="_blank" >BBS</a></li>
    <li><a href="http://blog.xuite.net/vexed/tech" target="_blank" >Blog</a></li>
    <li><a href="https://speakerdeck.com/pingyen" target="_blank" >Speaker Deck</a></li>
    <li><a href="https://plurk.com/vexed" target="_blank" >Plurk</a></li>
</ul>
<script>
(function() {
    var size = 414 * devicePixelRatio;

    document.querySelector('img').src = 'https://i1.wp.com/vexed.me/Vexed.png?resize=' + size + ',' + size;

    if (mobileCheck()) {
        var links = document.getElementsByTagName('a'),
            n = links.length;

        for (var i = 0; i < n; ++i) {
            links[i].target = '_self';
        }
    }

    function mobileCheck() {
        var check = false;

        (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);

        return check;
    }
})();
</script>
<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-6851063-2', 'auto');
    ga('send', 'pageview');
</script>
</body>
</html>

