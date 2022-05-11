"use strict";
/*
* 这是游戏的主控程序，下面有大量的变量和function，通过不断执行不同function来推进游戏进行
* 其中主要用于推进游戏流程，展示游戏流程信息的function是main_xxx()
*
* 作者：左半红印
* */

/*
* 注释说明：任何语句的说明都在该语句的上方
* */

//用于code.load延迟显示的默认值，每次load后del都会增加用于增加下一条load延迟显示的时间，单位毫秒
let del = 1000;
//用于code.load中每个字显示的延迟，从而达到打字显示的效果，单位毫秒
let every_word = 80;
//用于装在屏幕高和宽，在index.php中载入，在fix_row1_col1()中调整整个页面适配屏幕
let screen_height;
let screen_width;
//c是code的实例
let c;
let c0;
//code.load显示内容前自动增加的字符串，会被更改
let load_first = '/';
//这个数组用于储存游戏中可以用到的命令内容，未装载的命令无法使用
let user_actions_array = [];
//用于储存命令行中玩家输入的命令
let input_line;
//用于储存玩家输入的上一条命令
let last_line = '';
//cenumber命令的有效性判断，储存值是cenumber命令参数的正确值
let cenumber = 0;
//connect命令的有效性判断，储存值是connect命令参数的目标数组
let connect = 0;
let disconnect = 0;
let tutorial_connect = 0;
//scan命令的有效性判断
let scan = 0;
let tutorial_scan = 0;
//stream命令的有效性判断，储存值是stream命令参数的目标数组
let stream = 0;
let win_pos = [0, 0];
let win_id = 0;
let speaker_list = [['主管', 'LightGray'], ['现场', '#7B68EE']];
let img_list = [];
let file_img_list = ['black.jpg',
'house1.jpg',
'house2.jpg',
'house3.jpg',
'house4.jpg',
'house5.jpg',
'house6.jpg',
'house7.jpg',
'house8.jpg',
'keyboard.jpg',
'shufang.jpg',
'tianhuaban.jpg',
'level1.jpg',
'level2.jpg'];
let file_sound_list = [
    'boli.mp3',
    'guns.mp3',
    'snaper.wav',
    'wuxiandian_all.mp3',
    'wuxiandian_noisey.mp3',
    'wuxiandian_voice.mp3'
]
//网络中不同站点的密码值，如果玩家成功获取就储存在这个数组
let have_node = [];
//这个数组用于储存一些列
let net_node_list = [];
//用于储存每种命令的有效使用次数，当命令被有效使用时，该对象会发生变化。所谓有效使用指的是游戏中设置的关卡中玩家输入了正确的命令
let control_pad = {
    'control': {
        'cenumber': 0,
        'connect': 0,
        'scan': 0,
        'stream': 0,
        'disconnect': 0,
        'xxx5': 0,
        'xxx6': 0,
        'xxx7': 0,
        'xxx8': 0,
        'xxx9': 0
    },
    'value': {
        'cenumber': 0,
        'connect': 0,
        'scan': 0,
        'stream': 0,
        'disconnect': 0,
        'xxx5': 0,
        'xxx6': 0,
        'xxx7': 0,
        'xxx8': 0,
        'xxx9': 0
    }
};
/*
* 用于储存游戏流程推进的判断值，当对象中的on=1时，表示后面的value值用于当前关卡的目标值，
* 当上面control_pad中的value和这个对应on=1后面的value完全一致时表示这个关卡通关
* */
let control_chapter = {
    'one': {
        'on': 0,
        'value': {
            'cenumber': 1,
            'connect': 0,
            'scan': 0,
            'stream': 0,
            'disconnect': 0,
            'xxx5': 0,
            'xxx6': 0,
            'xxx7': 0,
            'xxx8': 0,
            'xxx9': 0
        }
    },
    'one_1': {
        'on': 0,
        'value': {
            'cenumber': 0,
            'connect': 1,
            'scan': 0,
            'stream': 0,
            'disconnect': 0,
            'xxx5': 0,
            'xxx6': 0,
            'xxx7': 0,
            'xxx8': 0,
            'xxx9': 0
        }
    },
    'one_2': {
        'on': 0,
        'value': {
            'cenumber': 0,
            'connect': 0,
            'scan': 1,
            'stream': 0,
            'disconnect': 0,
            'xxx5': 0,
            'xxx6': 0,
            'xxx7': 0,
            'xxx8': 0,
            'xxx9': 0
        }
    },
    'one_3': {
        'on': 0,
        'value': {
            'cenumber': 0,
            'connect': 1,
            'scan': 0,
            'stream': 1,
            'disconnect': 0,
            'xxx5': 0,
            'xxx6': 0,
            'xxx7': 0,
            'xxx8': 0,
            'xxx9': 0
        }
    },
    'one_4': {
        'on': 0,
        'value': {
            'cenumber': 0,
            'connect': 3,
            'scan': 0,
            'stream': 0,
            'disconnect': 0,
            'xxx5': 0,
            'xxx6': 0,
            'xxx7': 0,
            'xxx8': 0,
            'xxx9': 0
        }
    }
};
//游戏中网络中用于显示各个节点的图标，引用font-awsome实现
let icon_list = {
    'moden': '<i class="far fa-network-wired fa-2x node"></i>',
    'router': '<i class="fas fa-router fa-2x node"></i>',
    'server': '<i class="fas fa-server fa-2x node"></i>',
    'laptop': '<i class="fas fa-laptop fa-2x node"></i>',
    'pc': '<i class="fas fa-desktop fa-2x node"></i>',
    'phone': '<i class="fas fa-mobile-android-alt fa-2x node"></i>'
};
//数组的属性设置用于读取val所在的index
Array.prototype.indexOf = function(val) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
//配合上面的设置，用于删除数组中val元素
Array.prototype.remove = function(val) {
    let index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
//设置构造函数coder
let coder = function (dom) {
    this._dom = dom;
}
//设置构造函数code的属性，其中load属性用于显示文本，be500属性用于将del=500
coder.prototype = {
    constructor: coder,
    load: function(code,
                   second = null,
                   speaker = '主管',
                   className = null,
                   user_input = false,
                   callback = function () {}) {
        let dom = this._dom;
        if(second){
            del += second;
        }
        let div = document.createElement('div');
        if (className) {
            div.className = 'writecode ' + className;
        }
        else {
            div.className = 'writecode';
        }
        if (!user_input) {
            if (speaker != '' && speaker != 'null' && speaker != null) {
                let span = document.createElement('span');
                span.className = 'speaker';
                span.innerHTML = speaker;
                speaker_list.forEach(function (value) {
                    if (value[0] == speaker) {
                        $(span).css('background', value[1]);
                        $(span).css('color', 'black');
                    }
                });
                $(div).prepend(span);
            }
        }
        let data = code.split('');
        setTimeout(function() {
            $("#" + dom).append(div);
            let i = 0;
            let div_height = $(div).height();
            let last_height = div_height;
            if (!user_input) {
                function write() {
                    if (i < data.length) {
                        div.innerHTML += data[i];
                        //这里引入every_word，用于控制显示字符串中每个字符显示的速度
                        setTimeout(write.bind(this), every_word, ++i)
                    }
                    div_height = $(div).height();
                    if (div_height > last_height){
                        //用于row1_col1因显示内容增加而向上滚动，注意滚动高度那里的[0]，没有这个不起作用
                        $('#' + dom).scrollTop( $('#' + dom)[0].scrollHeight);
                    }
                    last_height = div_height;
                }
                write();
            }
            else {
                //这里引用load_first用于在玩家输入内容前加入固定内容，比如玩家当前connect的节点IP
                div.innerHTML = load_first + code;
            }
            $('#' + dom).scrollTop( $('#' + dom)[0].scrollHeight);
            callback();
        }, del);
        del += data.length * (every_word + 1);
    },
    be500: function () {
        del = 500;
    }
}
/*
* 这是游戏中网络中节点的构造函数
* name用于区别网络中不同节点
* type用于识别节点是什么，对应icon_list的不同图标
* link储存节点的父节点
* ip储存节点的IP
* col储存节点位于网络的第几层
* 下面四个参数会在show_local_network()中设置
* in储存节点链接父节点的坐标，数组
* out储存节点作为父节点的链接坐标，数组
* x，y储存节点的坐标
* content储存节点中的内容，通常是图片的相对地址
* show储存节点中content是否已经显示出来，boolean
* */
function net_node(iName, iType, iLink, iIp, iPassword, iCol, iIn, iOut, iX, iY, iContent = null, iShow = false) {
    this.name = iName;
    this.type = iType;
    this.link = iLink;
    this.ip = iIp;
    this.password = iPassword;
    this.col = iCol;
    this.in = iIn;
    this.out = iOut;
    this.x = iX;
    this.y = iY;
    this.content = iContent;
    this.show = iShow;
}

//程序入口，在head中引用
function init() {
    fix_row1_col1();
    init_load();
    c = new coder('row1_col1');
    c0 = new coder('row1_col2_content');
    keyboard_listen();
}

function init_load() {
    let queue = new createjs.LoadQueue(false);
    queue.installPlugin(createjs.Sound);
    queue.on("complete", handleComplete, this);
    // queue.loadFile({id:"sound", src:"http://path/to/sound.mp3"});
    let loadManifest = [
        {
            src: "https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js",
            id: 'aplayer.js'
        },
        {
            src: "https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js",
            id: 'meting.js'
        },
        {
            src: "/type-words/js/all.js",
            id: 'fontawsome.js'
        },
        {
            src: "https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css",
            id: 'aplayer.css'
        },
        {
            src: "/type-words/css/all.css",
            id: 'fontawsome.css'
        }
    ];
    file_img_list.forEach(function (value) {
        loadManifest.push({
            id: value.split('.')[0],
            src: 'images/' + value
        });
    });
    file_sound_list.forEach(function (value) {
        let src_str = 'sound/' + value;
        let id_str = value.split('.')[0];
        loadManifest.push({
            src: src_str,
            id: id_str
        });
        // createjs.Sound.registerSound(src_str, id_str);
    });
    queue.loadManifest(loadManifest);
    function handleComplete() {
        // createjs.Sound.play("sound");
        file_img_list.forEach(function (value) {
            img_list.push(queue.getResult(value.split('.')[0]));
        });
        // document.body.appendChild(image);
        title();
    }
}

function start() {
    let mask = $('#mask');
    mask.css('display', 'none');
    mask.empty();
    let str = "<meting-js server='netease' type='playlist' id='5057009360' autoplay='true' mini='true' loop='all' volume=0.1></meting-js>";
    $('#row3').append(str);
    register_sounds();
    user_actions();
    main_start();
}

function register_sounds() {
    let assetPath = "sound/";
    let sound_list = [{src: 'boli.mp3', data: {
        audioSprite: [{id: 'boli', startTime: 0, duration: 1500}]
        }},
        {src: 'guns.mp3', data: {
            audioSprite: [{id: 'guns', startTime: 0, duration: 3000}]
            }},
        {src: 'snaper.wav', data: {
            audioSprite: [{id: 'sniper'}]
            }},
        {src: 'wuxiandian_noisey.mp3', data: {
            audioSprite: [{id: 'wuxiandian_noisey', startTime: 0, duration: 3000}]
            }},
        {src: 'wuxiandian_voice.mp3', data: {
                audioSprite: [{id: 'wuxiandian_voice', startTime: 0, duration: 3000}]
            }}
    ];
    // file_sound_list.forEach(function (value) {
    //     sound_list.push({
    //         src: value,
    //         id: value.split('.')[0]
    //     });
    // })
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.registerSounds(sound_list, assetPath);
}

function play_sound(id, vol, idelay = null, ipan = null) {
    let ins = createjs.Sound.createInstance(id);
    ins.volume = vol;
    ins.delay = idelay;
    ins.pan = ipan;
    ins.play();
}

//适配浏览器长宽，目的是充满整个浏览器窗口且不出现滚动条
function fix_row1_col1() {
    let width = 0;
    let height = 0;
    width += $('#row1_col2').outerWidth();
    width += $('#row1_col3').outerWidth();
    height += $('#row2').outerHeight();
    height += $('#row3').outerHeight();
    width = screen_width - width - 24;
    height = screen_height - height - 24;
    $('#row1_col1').width(width);
    $('#row1_col1').height(height);
    let rc2c = $('#row1_col2_content');
    let rc3c = $('#row1_col3_content');
    rc2c.css('height', rc2c.height());
    rc3c.css('height', rc3c.height());
}

function title() {
    $('#mask').empty();
    let c_1 = new coder('mask');
    c_1.load('你好，这是一个打字类或者叫黑客模拟类的', 1000, null);
    c_1.load('游戏演示', 1000, null)
    c_1.load('请花几分钟通关这个小DEMO', 1000, null);
    c_1.load('', 2000, null, null, false, function () {
       let row1_height = $('#row1').outerHeight();
        $('#mask').animate({height: row1_height + 'px'}, 'slow', 'linear', function () {
            let top = row1_height - 48;
            let str = "<i class='fas fa-arrow-down fa-3x' style='color:white; position: fixed; left: 20px; top: " + top + "px'></i>";
            $('#mask').append(str);
        });
    });
    c_1.load('箭头所指的位置是你可以输入命令的地方，鼠标点击后可使用', 1000, null);
    c_1.load('游戏通过你输入的命令进行攻略', null, null);
    c_1.load('', 1000, null, null, false, function () {
       let str = "<div style='text-align: center'><buttom type='button' style='font-size: 1.5em; color: yellow' onclick='start()'>-->现在点我开始游戏<--</buttom></div>";
        $('#mask').append(str);
    });
}

//装载玩家可以使用的命令
function user_actions() {
    user_actions_array = ['cenumber', 'connect', 'scan', 'stream', 'disconnect'];
}

//下面所有main开头的方法都是游戏剧情流程方法，通过不同时间调用实现游戏内容的推进
function main_start() {
    del = 3000;
    c.load("完成加密链接", null, '>>', 'yellow_font');
    c.load("你们到了吗？");
    c.load("你们现在位于目标建筑物附近");
    c.load("从前期的观察来看，目标建筑物是一座别墅，拥有独立的保安系统");
    c.load("这次任务分两个部分");
    c.load("第一部分，破解门禁，这样我们的人就可以悄悄进入建筑物");
    c.load("第二部分，侵入别墅的监控系统，确认劫匪和人质的位置");
    c.load("我们的便衣马上会假扮清洁人员，并接触门禁，这是你们破解门禁的唯一机会");
    c.load("", 2000, null, null, false, function callback(){
        show_img(['/type-words/images/keyboard.jpg'], 'row1_col2_content', 150);
    });
    c.load("现场监控链接完成", null, '>>', 'yellow_font');
    c.load("密码键盘链接完成", null, '>>', 'yellow_font', false, function (callback) {
        cenumber = 4;
        control_chapter.one.on = 1;
    });
    c.load('看来我们运气不错，这是一种老式的密码系统，总共4位数字');
    c.load('4位纯数字密码，用穷举法就能解决，试试命令cenumber');
    c.be500();
}

function main_one() {
    cenumber = 0;
    tutorial_connect = 1;
    c.load("可以了，我们进入第二阶段", null, '主管', null, false, function () {
        $('#row1_col2_content').empty();
    });
    c.load('接下来才是重点，我们要侵入这座别墅的内部保安系统');
    c.load('从通讯公司那边，我们已经获取了他们的公网IP和访问权限');
    c.load('嗯……公网IP是202.123.23.4，你不会忘了链接命令吧？用connect');
    c.load("已检测到一个可访问端口", null, '>>', 'yellow_font');
    c.load("已获取管理员权限", null, '>>', 'yellow_font');
    c.load('', null, null, null, false, function () {
        connect = ['192.168.0.1'];
        have_node[have_node.length] = {'name': '1-0', 'password': 'aih23n'};
        row1_col2_show_password('192.168.0.1', 'aih23n');
        public_network();
        show_local_network(net_node_list);
        control_chapter.one_1.on = 1;
    })
    c.be500();
}

function main_one_1() {
    c.be500();
    c.load('我们进来了');
    c.load('现在扫描整个用户网络', 1000);
    c.load('……', 1000);
    c.load('我说，现在扫描整个用户网络……你不会不知道怎么做吧', 1000);
    c.load('scan啊！用scan命令，你果然是个菜鸟');
    c.load('', null, null, null, false, function () {
        network_one();
        scan = net_node_list;
        control_chapter.one_2.on = 1;
    })
    c.be500();
}

function main_one_2() {
    tutorial_scan = 1;
    c.be500();
    c.load('嗯，让我看看……');
    c.load('一个普通家庭里怎么会有一台服务器？就是192.168.1.100那台，一定就是安保系统的服务器了，相信我，大部分家里安装这玩意的富豪都不知道它该怎么用，反正都有安保公司24小时盯着');
    c.load('听好了，我们需要它的监控画面');
    c.load('怎么？你不会这就想直接connect它吧？拜托成熟一点，这种服务器肯定有访问权限限制的');
    c.load('问安保公司要？不可能的，他们会以客户隐私拒绝，真要进行交涉弄到也要走很久很久的法律流程，我们等不了');
    c.load('所以现在就是大显身手的时候了，我们黑进去');
    c.load('不要想用钓鱼软件那种老掉牙的东西了，效率极低不说，还容易被发现');
    c.load('用stream命令，这是公司开发的新玩意，通过截获目标与外界的通讯信息流，把病毒代码分段藏在不同的信息流里');
    c.load('任何一段信息流里的病毒代码都是无害且以注释信息传送，没有任何一款防火墙会拦截它');
    c.load('然后，只要过一小段时间，等所有病毒代码都发送至目标内，再激活，就大功告成了');
    c.load('好了，别磨叽，我也是第一次看这玩意的运作');
    c.load('', null, null, null, false, function () {
        network_one();
        connect = ['192.168.1.100'];
        stream = ['192.168.1.100'];
        control_chapter.one_3.on = 1;
    })
    c.be500();
}

function main_one_3() {
    c.be500();
    c.load('很好!接入战术窗口，匹配生物信号');
    c.load(' ', null, null, null, false, function () {
        show_window('战术视窗', 300, '/type-words/images/level1.jpg');
        show_window('战术视窗', 300, '/type-words/images/level2.jpg');
        show_units_one();
    }, null);
    c.load("已完成生物信息匹配", null, '>>', 'yellow_font');
    c.load('绑匪匹配红色标记，人质匹配白色标记');
    c.load('如果战术窗口挡住了你的视野，可以托动它');
    c.load('看来今天的工作结束了，可以下个早……嗯？……什么？……见鬼……', 1000);
    c.load('嗯，跟你想的一样，任务升级了，似乎监控系统的这几个摄像头的图像所显示的信息不够');
    c.load('我们必须继续下去，看到网络中其他设备了吗？');
    c.load('一般来说笔记本电脑、手机都自配摄像头，把画面获取过来');
    c.load('', null, null, null, false, function () {
        stream = [];
        connect = ['192.168.1.102', '192.168.1.103', '192.168.1.104'];
        control_chapter.one_4.on = 1;
    });
    c.be500();
}

function main_one_4() {
    c.be500();
    c.load('现在让我们看看运气如何……天花板……黑屏，应该是被遮住了……这个是……');
    c.load('应该是书房，可以了，干得不错');
    c.load("更新生物信息匹配", null, '>>', 'yellow_font');
    c.load('', null, null, null, false, function () {
        let canvas = document.createElement('canvas');
        canvas.width = 14;
        canvas.height = 14;
        canvas.id = 'enemy_2';
        canvas.className = 'enemy units';
        let dat_tx = canvas.getContext('2d');
        dat_tx.beginPath();
        dat_tx.arc(7,7,4,0, 2*Math.PI);
        dat_tx.strokeStyle = 'yellow';
        dat_tx.lineWidth = 2
        dat_tx.stroke();
        dat_tx.fillStyle = 'red';
        dat_tx.fill();
        $('#win_1 .window_content').append(canvas);
        $('#win_1 #enemy_2').css('top', '120px');
        $('#win_1 #enemy_2').css('left', '150px');
        show_units_two();
        $('meting-js')[0].aplayer.pause();

    });
    c.load('我们的工作结束了，接下来交给行动组', 2000);
    c.load("现场信号接入成功", null, '>>', 'yellow_font');
    c.load("1小队正门就位", null, '现场', null, false, function () {
        play_sound('wuxiandian_noisey', 0.2);
        play_sound('wuxiandian_voice', 0.1, 500);
    });
    c.load('2小队开始行动', null, '现场');
    c.load("已打开正门，进入目标建筑物前院", null, '现场');
    c.load('', null, null, null, false, function () {
        c.be500();
        move_units_one();
    });
}

function main_one_5() {
    c.be500();
    c.load("狙击手视野良好，所有小队准备", null, '现场');
    c.load("开火，开火，开火", 2000, '现场');
    c.load('', null, null, null, false, function () {
        play_sound('sniper', 0.2);
        c.be500();
        move_units_two();
    });
}

function main_one_6() {
    end();
}

function end() {
    c.be500();
    c.load(' ', null, null, null, false, function () {
        $('meting-js')[0].aplayer.play();
    });
    c.load('恭喜通关！感谢游玩！', null, null);
    c.load('这是一个相当早期和简陋的DEMO', null, null);
    c.load('无论是否喜欢请告诉我你的游玩感受', null, null);
    c.load('而如果你对这个项目感兴趣，又具备剧情创作 或 FUI设计 或 美术设计等能力，请联系我', null, null);
    c.load('', null, null, null, false, function () {
        let str = "<div style='text-align: center'><a href='https://www.redonleft.com/a-hacker-game/' type='button' style='font-size: 1.5em; color: yellow' onclick='start()'>-->点我留言<--</a></div>";
        $('#row1_col1').append(str);
        $('#row1_col1').scrollTop( $('#row1_col1')[0].scrollHeight);
    })
}

//用于显示图片的方法
function show_img(list, dom, cc) {
    let jq_dom = $('#' + dom);
    list.forEach(function (value) {
        let img = document.createElement('img')
        img.src = value;
        img.width = cc;
        img.height = cc;
        $(img).css('object-fit', 'contain');
        jq_dom.append(img);
    });
    jq_dom.scrollTop(jq_dom[0].scrollHeight);
}

//键盘监听，玩家命令输入完毕的标志是按下回车键
function keyboard_listen() {
    $('#keyboard_input').on('keypress',function (e) {
        if (e.which === 13) {
            input_line = $(this).val();
            last_line = input_line;
            $(this).val('');
            c.be500();
            c.load(input_line, null, null, null, true, function () {
                c.be500();
                let have = false;
                let data = input_line.split(' ');
                user_actions_array.forEach(function (value) {
                    if (value == data[0]) {
                        have = true;
                        //当玩家输入内容符合下面的各种命令时，出发的后续效果，如果输入是有效的则触发f开头的对应方法
                        if (data[0] == 'cenumber') {
                            if (cenumber == 0) {
                                c.load('命令无可作用对象', null, null, null, true);
                            }
                            else if (!data[1] || data[1] != cenumber) {
                                c.load('命令参数错误', null, null, null, true);
                                if (tutorial_connect == 0) {
                                    c.be500();
                                    c.load('我就知道！我就知道！会这样！');
                                    c.load('听好了，菜鸟，大部分计算机命令都需要搭配参数才能正常使用');
                                    c.load('这是一个4位数的穷举命令，正确的命令是cenumber 4');
                                    tutorial_connect = 1;
                                }
                            }
                            else {
                                f_cenumber(cenumber);
                            }
                        }
                        if (data[0] == 'connect') {
                            let arg_ok = false;
                            let node_ok;
                            net_node_list.forEach(function (value) {
                                if (value.ip == data[1]) {
                                    arg_ok = true;
                                    node_ok = value;
                                }
                            });
                            if (!arg_ok) {
                                net_node_list.forEach(function (value) {
                                    if (value.link == data[1]) {
                                        arg_ok = true;
                                        node_ok = value;
                                    }
                                });
                            }
                            if (connect == 0) {
                                c.load('命令无可作用对象', null, null, null, true);
                            }
                            else if (!data[1] || !arg_ok) {
                                c.load('命令参数错误', null, null, null, true);
                            }
                            else {
                                f_connect(node_ok, connect);
                            }
                        }
                        if (data[0] == 'scan') {
                            if (scan == 0) {
                                c.load('命令无可作用对象', null, null, null, true);
                            }
                            else if (data[1]) {
                                c.load('命令参数错误,scan命令不需要搭配参数', null, null, null, true);
                                if (tutorial_scan == 0) {
                                    c.load('天……又来了……');
                                    c.load('大部分计算机命令都需要搭配参数才能正常使用，但不是全部！');
                                    c.load('scan命令会自动检测你所在的网络节点，并扫描整个网络，所以不需要任何附加参数');
                                    tutorial_scan = 1;
                                }
                            }
                            else {
                                f_scan(scan);
                            }
                        }
                        if (data[0] == 'stream') {
                            let arg_ok = false;
                            let node_ok;
                            net_node_list.forEach(function (value) {
                                if (value.ip == data[1]) {
                                    arg_ok = true;
                                    node_ok = value;
                                }
                            });
                            if (!arg_ok) {
                                net_node_list.forEach(function (value) {
                                    if (value.link == data[1]) {
                                        arg_ok = true;
                                        node_ok = value;
                                    }
                                });
                            }
                            if (stream === 0) {
                                c.load('命令无可作用对象', null, null, null, true);
                            }
                            else if (!data[1] || !arg_ok) {
                                c.load('命令参数错误', null, null, null, true);
                            }
                            else {
                                f_stream(node_ok, stream);
                            }
                        }
                        if (data[0] == 'disconnect') {
                            if (disconnect == 0) {
                                c.load('未链接到任何网络节点', null, null, null, true);
                            }
                            else {
                                f_disconnect();
                            }
                        }
                    }
                });
                if (!have) {
                    c.load('命令不可识别', null, null, null ,true);
                }
            });
        }
    });
    //按上箭头可以自动输入上次输入的内容，引入last_line
    $('#keyboard_input').on('keydown',function (e) {
        if (e.which === 38){
            if (last_line != '') {
                $(this).val(last_line);
            }
        }
    });
}

function mouse_listen() {
    let start_x = 0;
    let start_y = 0;
    let mouse_x;
    let mouse_y;
    let control_window = false;
    let win = null;
    $(document).mousedown(function (e) {
        if(e.which == 1){
            let obj = e.target;
            if ($(obj).hasClass('window')) {
                $('.window').each(function () {
                    $(this).css('z-index', 1);
                });
                $(obj).css('z-index', 2);
            }
            else if ($(obj).parents().hasClass('window')) {
                $('.window').each(function () {
                    $(this).css('z-index', 1);
                });
                $(obj).parents('.window').css('z-index', 2);
            }
        }
    });
    $('.title_line').each(function () {
        $(this).mousedown(function (e) {
            if(e.which == 1){
                control_window = true;
                mouse_x = e.originalEvent.x || e.originalEvent.layerX || 0;
                mouse_y = e.originalEvent.y || e.originalEvent.layerY || 0;
                win = $(this).parent();
                start_x = win.position().left;
                start_y = win.position().top;

            }
        });
    });
    $(document).mousemove(function (e) {
        if (control_window) {
            let mouse_x_now = e.originalEvent.x || e.originalEvent.layerX || 0;
            let mouse_y_now = e.originalEvent.y || e.originalEvent.layerY || 0;
            let x_in = mouse_x_now - mouse_x;
            let y_in = mouse_y_now - mouse_y;
            win.css('left', start_x + x_in);
            win.css('top', start_y + y_in);
        }
    });
    $(document).mouseup(function (e) {
        if (control_window) {
            control_window = false;
            win = null;
        }
    });
}

//cenumber命令方法，符合关卡要求时触发control_pad，后面都是如此
function f_cenumber(number) {
    let show_array = [];
    let str = '';
    let c;
    let div = document.createElement('div');
    div.className = 'writecode yellow_font';
    $(div).height(21);
    $("#row1_col1").append(div);
    $("#row1_col1").scrollTop( $("#row1_col1")[0].scrollHeight);
    let i = 0;
    let all_time = number * 1000
    function random_number() {
        if (i < number) {
            c = setInterval(function () {
                str = '';
                let number_in = number - i
                for (let index = 0; index < number_in; index++) {
                    show_array[index] = Math.floor(Math.random() * 10);
                }
                show_array.forEach(function (value) {
                    str = value + ' ' + str;
                });
                div.innerHTML = str;
            }, 100);
            setTimeout(function () {
                clearInterval(c);
                i++;
                random_number();
                all_time -= 1000;
            }, all_time);
        }
        else {
            clearInterval(c);
            control_pad.control.cenumber = 1;
        }
    }
    random_number();
}

//connect命令方法
function f_connect(node_ok, need_ip) {
    c.be500();
    if (!node_ok.password){
        c.load("登录成功！", null, '>>', 'yellow_font');
        c.load("成功链接至"+node_ok.ip, null, '>>', 'yellow_font');
        c.load("", null, null, false, function () {
            load_first = node_ok.ip + '/';
            if (!node_ok.show && node_ok.content != null) {
                show_img(node_ok.content, 'row1_col3_content', 100);
                node_ok.show = true;
            }
            disconnect = 1;
            need_ip.forEach(function (value) {
                if (node_ok.ip == value){
                    need_ip.remove(value);
                    control_pad.control.connect = 1;
                }
            });
        });
    }
    else {
        let have_password = false;
        let user_password
        have_node.forEach(function (value) {
            if (node_ok.name == value.name) {
                have_password = true;
                user_password = value.password;
            }
        });
        if (have_password) {
            c.load("正在使用已有凭据登录……", null, '>>', 'yellow_font');
            c.load("-user admin -password " + user_password, null, '>>', 'yellow_font');
            c.load("成功链接至"+node_ok.ip, null, '>>', 'yellow_font');
            c.load('', null, null, null, false, function () {
                load_first = node_ok.ip + '/';
                if (!node_ok.show && node_ok.content != null) {
                    show_img(node_ok.content, 'row1_col3_content', 100);
                    node_ok.show = true;
                }
                disconnect = 1;
                need_ip.forEach(function (value) {
                    if (node_ok.ip == value){
                        need_ip.remove(value);
                        control_pad.control.connect = 1;
                    }
                });
            });
        }
        else {
            c.load("未获得登录权限", null, null, null, true);
            return;
        }
    }
}

//scan命令方法，主要引用show_local_network方法
function f_scan(list = []) {
    show_local_network(list);
    control_pad.control.scan = 1;
}

//stream命令方法
function f_stream(node_ok, need_ip) {
    if (!node_ok.password) {
        c.load("该站点未设置权限限制", null, null, null, true);
        return;
    }
    else {
        have_node.forEach(function (value) {
            if (value.name == node_ok.name) {
                c.load("已匹配到该站点登录权限", null, null, null, true);
                return;
            }
        });
    }
    let finish_now = 0;
    let finish_need = 3;
    let row1_col1 = $("#row1_col1");
    function insert_div() {
        let div = document.createElement('div');
        div.className = 'stream_border';
        let div_in = document.createElement('div');
        div_in.className = 'stream_content';
        $(div).append(div_in);
        row1_col1.append(div);
        row1_col1.scrollTop(row1_col1[0].scrollHeight);
        return div_in;
    }
    let div_1 = insert_div();
    let div_2 = insert_div();
    let div_3 = insert_div();
    let code_border_width = $(div_1).width();
    function random_width(all_width) {
        return Math.floor((Math.random() * 21 + 20) / 100 * all_width);
    }
    let code_width = random_width(code_border_width);
    let code_width_1 = random_width(code_border_width);
    let code_width_2 = code_border_width - code_width - code_width_1;
    function control_content() {
        let content_width = 0;
        let left_content = 0;
        let str = '';
        let c = setInterval(function () {
            if (content_width < code_width) {
                let color_stop = content_width + 1;
                str = 'linear-gradient(to right, red ' + content_width + 'px, rgba(0, 0, 0, 0) ' + color_stop + 'px)';
                $(div_1).css('background-image',str);
                content_width += 1;
            }
            else {
                content_width = code_width;
                let color_stop_1 = left_content + 1;
                let color_stop_2 = left_content + content_width;
                let color_stop_3 = left_content + content_width + 1;
                str = 'linear-gradient(to right, #bdde2d ' + left_content + 'px, red ' + color_stop_1 + 'px, red ' + color_stop_2 + 'px, rgba(0, 0, 0, 0) ' + color_stop_3 + 'px)'
                $(div_1).css('background-image',str);
                left_content += 1;
            }
            if (left_content + content_width >= code_border_width) {
                clearInterval(c);
                finish_now++;
                if (finish_now == finish_need) {
                    give_password();
                }
            }
        }, 10);
    }
    function control_content_1() {
        let content_width = 0;
        let left_content = 0;
        let middle_width = 0;
        let str = '';
        let c = setInterval(function () {
            if (content_width < code_width) {
                let color_stop = content_width + 1;
                str = 'linear-gradient(to right, #bdde2d ' + content_width + 'px, rgba(0, 0, 0, 0) ' + color_stop + 'px)';
                $(div_2).css('background-image',str);
                content_width += 1;
            }
            else if (middle_width < code_width_1) {
                content_width = code_width;
                let color_stop_1 = middle_width + 1;
                let color_stop_2 = middle_width + content_width;
                let color_stop_3 = middle_width + content_width + 1;
                str = 'linear-gradient(to right, red ' + middle_width + 'px, #bdde2d ' + color_stop_1 + 'px, #bdde2d ' + color_stop_2 + 'px, rgba(0, 0, 0, 0) ' + color_stop_3 + 'px)';
                $(div_2).css('background-image',str);
                middle_width += 1;
            }
            else {
                content_width = code_width;
                middle_width = code_width_1;
                let color_stop_1 = left_content + 1;
                let color_stop_2 = left_content + middle_width;
                let color_stop_3 = left_content + middle_width + 1;
                let color_stop_4 = left_content + middle_width + content_width;
                let color_stop_5 = left_content + middle_width + content_width + 1;
                str = 'linear-gradient(to right, #bdde2d ' + left_content + 'px, red ' + color_stop_1 + 'px, red ' + color_stop_2 + 'px, #bdde2d ' + color_stop_3 + 'px, #bdde2d ' + color_stop_4 + 'px, rgba(0, 0, 0, 0) ' + color_stop_5 + 'px)';
                $(div_2).css('background-image',str);
                left_content += 1;
            }
            if (left_content + content_width + middle_width >= code_border_width) {
                clearInterval(c);
                finish_now++;
                if (finish_now == finish_need) {
                    give_password();
                }
            }
        }, 10);
    }
    function control_content_2() {
        let content_width = 0;
        let left_content = 0;
        let str = '';
        let c = setInterval(function () {
            if (content_width < code_border_width - code_width_2) {
                let color_stop = content_width + 1;
                str = 'linear-gradient(to right, #bdde2d ' + content_width + 'px, rgba(0, 0, 0, 0) ' + color_stop + 'px)';
                $(div_3).css('background-image',str);
                content_width += 1;
            }
            else {
                content_width = code_border_width - code_width_2;
                let color_stop_1 = left_content + 1;
                let color_stop_2 = left_content + content_width;
                let color_stop_3 = left_content + content_width + 1;
                str = 'linear-gradient(to right, red ' + left_content + 'px, #bdde2d ' + color_stop_1 + 'px, #bdde2d ' + color_stop_2 + 'px, rgba(0, 0, 0, 0) ' + color_stop_3 + 'px)';
                $(div_3).css('background-image',str);
                left_content += 1;
            }
            if (left_content + content_width >= code_border_width) {
                clearInterval(c);
                finish_now++;
                if (finish_now == finish_need) {
                    give_password();
                }
            }
        }, 10);
    }
    control_content();
    control_content_1();
    control_content_2();
    function randomString(e) {
        e = e || 32;
        let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz012345678",
            a = t.length,
            n = "";
        for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
        return n
    }
    function give_password() {
        let password = randomString(6);
        have_node[have_node.length] = {'name': node_ok.name, 'password': password};
        c.load('已获取' + node_ok.ip + '访问权限', null, '>>', 'yellow_font');
        row1_col2_show_password(node_ok.ip, password);
        c.load('', null, null, null, false, function () {
            need_ip.forEach(function (value) {
                if (node_ok.ip == value) {
                    need_ip.remove(value);
                    control_pad.control.stream = 1;
                }
            });
        });
    }
}

function f_disconnect() {
    public_network();
    show_local_network(net_node_list);
    load_first = '/';
    disconnect = 0;
}

//每次control_pad发生变化后都会引用这个方法，用于判断游戏进程是否可以推进
function check_control_chapter() {
    if (control_chapter.one.on == 1){
        let can_in = true;
        Object.keys(control_chapter.one.value).forEach(function (key) {
            if (control_pad['value'][key] != control_chapter['one']['value'][key]) {
                can_in = false;
            }
        });
        if (can_in) {
            control_chapter.one.on = 2;
            Object.keys(control_pad.value).forEach(function (key) {
                control_pad['value'][key] = 0;
            });
            main_one();
        }
    }
    if (control_chapter.one_1.on == 1){
        let can_in = true;
        Object.keys(control_chapter.one_1.value).forEach(function (key) {
            if (control_pad['value'][key] != control_chapter['one_1']['value'][key]) {
                can_in = false;
            }
        });
        if (can_in) {
            control_chapter.one_1.on = 2;
            Object.keys(control_pad.value).forEach(function (key) {
                control_pad['value'][key] = 0;
            });
            main_one_1();
        }
    }
    if (control_chapter.one_2.on == 1){
        let can_in = true;
        Object.keys(control_chapter.one_2.value).forEach(function (key) {
            if (control_pad['value'][key] != control_chapter['one_2']['value'][key]) {
                can_in = false;
            }
        });
        if (can_in) {
            control_chapter.one_2.on = 2;
            Object.keys(control_pad.value).forEach(function (key) {
                control_pad['value'][key] = 0;
            });
            main_one_2();
        }
    }
    if (control_chapter.one_3.on == 1) {
        let can_in = true;
        Object.keys(control_chapter.one_3.value).forEach(function (key) {
            if (control_pad['value'][key] != control_chapter['one_3']['value'][key]) {
                can_in = false;
            }
        });
        if (can_in) {
            control_chapter.one_3.on = 2;
            Object.keys(control_pad.value).forEach(function (key) {
                control_pad['value'][key] = 0;
            });
            main_one_3();
        }
    }
    if (control_chapter.one_4.on == 1) {
        let can_in = true;
        Object.keys(control_chapter.one_4.value).forEach(function (key) {
            if (control_pad['value'][key] != control_chapter['one_4']['value'][key]) {
                can_in = false;
            }
        });
        if (can_in) {
            control_chapter.one_4.on = 2;
            Object.keys(control_pad.value).forEach(function (key) {
                control_pad['value'][key] = 0;
            });
            main_one_4();
        }
    }
}

//control_pad对象监听，一旦进行赋值则引用check_control_chapter方法
Object.defineProperties(control_pad.control, {
    'cenumber': {
        set: function (v) {
            control_pad.value.cenumber = v;
            check_control_chapter();
        }
    },
    'connect': {
        set: function (v) {
            control_pad.value.connect += v;
            check_control_chapter();
        }
    },
    'scan': {
        set: function (v) {
            control_pad.value.scan += v;
            check_control_chapter();
        }
    },
    'stream': {
        set: function (v) {
            control_pad.value.stream = v;
            check_control_chapter();
        }
    }
});

/*
* 一个游戏内网络的初始化方法，用于设定net_code_list，后面的展示网络会用到这个数组，后续方法相同
* 参照构造函数net_node
* */
function network_one() {
    let list = [];
    let net_node_0 = new net_node('1-0', 'moden', '202.123.23.4', '192.168.0.1', true, 0, 0, 0, 0, 0, null);
    let net_node_1 = new net_node('1-1', 'router', '192.168.0.1', '192.168.1.1', false, 1, 0, 0, 0, 0, null);
    for (let i = 1; i <= 7; i++) {
        list.push('/type-words/images/house'+ i +'.jpg');
    }
    let net_node_2 = new net_node('1-2', 'server', '192.168.1.1', '192.168.1.100', true, 2, 0, 0, 0, 0, list);
    let net_node_3 = new net_node('1-3', 'pc', '192.168.1.1', '192.168.1.101', true, 2, 0, 0, 0, 0, null);
    list = ['/type-words/images/shufang.jpg'];
    let net_node_4 = new net_node('1-4', 'laptop', '192.168.1.1', '192.168.1.102', true, 2, 0, 0, 0, 0, list);
    list = ['/type-words/images/black.jpg'];
    let net_node_5 = new net_node('1-5', 'phone', '192.168.1.1', '192.168.1.103', true, 2, 0, 0, 0, 0, list);
    list = ['/type-words/images/tianhuaban.jpg'];
    let net_node_6 = new net_node('1-6', 'phone', '192.168.1.1', '192.168.1.104', true, 2, 0, 0, 0, 0, list);
    net_node_list = [net_node_0, net_node_1, net_node_2, net_node_3, net_node_4, net_node_5, net_node_6];
}

function public_network() {
    let net_node_0 = new net_node('1-0', 'moden', '202.123.23.4', '192.168.0.1', true, 0, 0, 0, 0, 0, null);
    net_node_list = [net_node_0];
}

//在row3中进行网络绘制，依据net_node_list信息
function show_local_network(list = []) {
    let col_num = [];
    let col_in_num = [];
    let max_col = 0;
    let row3_height = $('#row3').innerHeight();
    $('.row3_canvas').remove();
    //利用canvas定位list中不同元素的位置
    let canvas = document.createElement('canvas');
    canvas.className = 'row3_canvas'
    canvas.width = $('#row3').innerWidth();
    canvas.height = $('#row3').innerHeight();
    list.forEach(function (value) {
        if (value.col > max_col) {
            max_col = value.col;
        }
    });
    for (let i = 0; i <= max_col; i++) {
        col_num[i] = 0;
        col_in_num[i] = 0;
    }
    let node_width = 32;
    let node_height = 32;
    let dat_tx = canvas.getContext('2d');
    list.forEach(function (value) {
        dat_tx.beginPath();
        dat_tx.strokeStyle = "#bdde2d";
        dat_tx.lineWidth = 2;
        let x = value.col * 150 + 10 + col_in_num[value.col] * 110;
        let y = col_num[value.col] * 60 + 10 + col_in_num[value.col] * 10;
        if (y > row3_height - 53) {
            col_num[value.col] = 0;
            col_in_num[value.col] += 1;
            x = value.col * 150 + 10 + col_in_num[value.col] * 110;
            y = col_num[value.col] * 60 + 10 + col_in_num[value.col] * 10;
        }
        value.x = x;
        value.y = y;
        value.in = [x, y + node_height / 2];
        value.out = [x + node_width, y + node_height / 2];
        dat_tx.font = 'bold 14px consolas';
        dat_tx.textAlign = 'left';
        dat_tx.textBaseline = 'top';
        dat_tx.fillStyle = '#bdde2d';
        dat_tx.fillText(value.ip, x,y + 37);
        col_num[value.col]++;
    });
    //为不同node之间进行连线
    list.forEach(function (value) {
        list.forEach(function (value_1) {
            if (value.link == value_1.ip) {
                dat_tx.beginPath();
                dat_tx.moveTo(value.in[0], value.in[1]);
                dat_tx.lineTo(value_1.out[0], value_1.out[1]);
                dat_tx.stroke();
            }
        })
    })
    $('#row3').prepend(canvas);
    //为不同node放上font-awsome图标
    list.forEach(function (value) {
        Object.keys(icon_list).forEach(function (key) {
            if (value.type == key) {
                let new_e = $(icon_list[key]);
                new_e.css('top', value.y);
                new_e.css('left', value.x);
                $('#row3').append(new_e);
            }
        })
    })
}

function row1_col2_show_password(ip, password) {
    c0.be500();
    c0.load('主机ip：'+ip+' 用户名：admin 密码：'+password, null, null, 'show_password', true)
}

function show_window (str, cc, content) {
    let window = document.createElement('div');
    window.className = 'window';
    window.id = 'win_' + win_id;
    win_id++;
    $(window).css('width', cc);
    $(window).css('height', cc);
    win_pos[0] += 30;
    win_pos[1] += 30;
    $(window).css('left', win_pos[0]+'px');
    $(window).css('top', win_pos[1]+'px');
    let title_line = document.createElement('div');
    title_line.className = 'title_line';
    str = '<p>' + str + '</p>';
    $(title_line).append($(str));
    let times = "<i class='fal fa-times-square close_buttom' style='color:#bdde2d;'></i>";
    $(title_line).append($(times));
    let window_content = document.createElement('div');
    window_content.className = 'window_content';
    let img = document.createElement('img');
    img.src = content
    $(window_content).prepend($(img));
    $(window).prepend(title_line);
    $(window).append(window_content);
    $('#background').append(window);
    mouse_listen();
}

function give_units(dom, str, num, icolor) {
    for (let i = 0; i < num; i++){
        let canvas = document.createElement('canvas');
        canvas.width = 14;
        canvas.height = 14;
        canvas.id = str+ '_' + i;
        canvas.className = str + ' units';
        let dat_tx = canvas.getContext('2d');
        dat_tx.beginPath();
        dat_tx.arc(7,7,4,0, 2*Math.PI);
        dat_tx.strokeStyle = 'yellow';
        dat_tx.lineWidth = 2
        dat_tx.stroke();
        dat_tx.fillStyle = icolor;
        dat_tx.fill();
        $(dom).append(canvas);
    }
}

function show_units_one() {
    give_units('#win_0 .window_content', 'enemy', 4, 'red');
    $('#win_0 #enemy_0').css('top', '100px');
    $('#win_0 #enemy_0').css('left', '100px');
    $('#win_0 #enemy_1').css('top', '120px');
    $('#win_0 #enemy_1').css('left', '100px');
    $('#win_0 #enemy_2').css('top', '100px');
    $('#win_0 #enemy_2').css('left', '200px');
    $('#win_0 #enemy_3').css('top', '130px');
    $('#win_0 #enemy_3').css('left', '220px');
    give_units('#win_1 .window_content', 'enemy', 2, 'red');
    $('#win_1 #enemy_1').css('top', '90px');
    $('#win_1 #enemy_1').css('left', '160px');
    $('#win_1 #enemy_0').css('top', '110px');
    $('#win_1 #enemy_0').css('left', '200px');
    give_units('#win_1 .window_content', 'person', 4, 'white');
    $('#win_1 #person_0').css('top', '120px');
    $('#win_1 #person_0').css('left', '220px');
    $('#win_1 #person_1').css('top', '120px');
    $('#win_1 #person_1').css('left', '230px');
    $('#win_1 #person_2').css('top', '115px');
    $('#win_1 #person_2').css('left', '245px');
    $('#win_1 #person_3').css('top', '125px');
    $('#win_1 #person_3').css('left', '250px');
}

function show_units_two() {
    give_units('#win_0 .window_content', 'police', 6, 'blue');
    $('#win_0 #police_0').css('top', '65px');
    $('#win_0 #police_0').css('left', '5px');
    $('#win_0 #police_1').css('top', '75px');
    $('#win_0 #police_1').css('left', '5px');
    $('#win_0 #police_2').css('top', '85px');
    $('#win_0 #police_2').css('left', '5px');
    $('#win_0 #police_3').css('top', '40px');
    $('#win_0 #police_3').css('left', '270px');
    $('#win_0 #police_4').css('top', '30px');
    $('#win_0 #police_4').css('left', '270px');
    $('#win_0 #police_5').css('top', '70px');
    $('#win_0 #police_5').css('left', '270px');
}

function show_units_three() {
    give_units('#win_1 .window_content', 'police', 4, 'blue');
    $('#win_1 #police_0').css('top', '55px');
    $('#win_1 #police_0').css('left', '5px');
    $('#win_1 #police_1').css('top', '65px');
    $('#win_1 #police_1').css('left', '5px');
    $('#win_1 #police_2').css('top', '60px');
    $('#win_1 #police_2').css('left', '275px');
    $('#win_1 #police_3').css('top', '80px');
    $('#win_1 #police_3').css('left', '275px');
}

function move_units_one() {
    $('#win_0 #police_0').animate({
        top: '55px'
    }, 1000, 'linear',function () {
        $('#win_0 #police_0').animate({
            top: '95px',
            left: '45px'
        }, 2000, 'linear');
    });
    $('#win_0 #police_1').animate({
        top: '55px'
    }, 1500, 'linear',function () {
        $('#win_0 #police_1').animate({
            top: '85px',
            left: '35px'
        }, 2000, 'linear');
    });
    $('#win_0 #police_2').animate({
        top: '55px'
    }, 2000, 'linear',function () {
        $('#win_0 #police_2').animate({
            top: '75px',
            left: '35px'
        }, 2000, 'linear', function () {
            c.load('1小队就位', null, '现场');
            c.load('3小队开始行动', null, '现场');
            c.load('4小队开始行动', null, '现场');
            c.load('', null, null, null, false, function () {
                show_units_three();
            })
            c.load('4小队就位', null, '现场');
            c.load('', null, null, null, false, function () {
                c.be500();
               $('#win_1 #police_0').animate({
                   left: '45px'
               }, 1000, 'linear');
               $('#win_1 #police_1').animate({
                   left: '45px'
               }, 1000, 'linear', function () {
                   c.load('3小队就位', null, '现场');
                   c.load('狙击手就位', null, '现场');
                   c.load('', null, null, null, false, function () {
                       main_one_5();
                   });
               });
            });
        });
    });
    $('#win_0 #police_3').animate({
        left: '255px'
    }, 1000, 'linear');
    $('#win_0 #police_4').animate({
        left: '255px'
    }, 1000, 'linear');
    $('#win_0 #police_5').animate({
        left: '255px'
    }, 1000, 'linear', function () {
        c.load('2小队就位', null, '现场');
    });
}

function move_units_two() {
    let cross = "<i class='fal fa-times cross' ";
    function make_cross(dom) {
        let top = $(dom).css('top');
        let left = $(dom).position().left + 2;
        let style_str = "style='top:"+top+"; left:"+left+"px;'";
        let out_cross = cross + style_str + "></i>";
        return out_cross;
    }
    c.load('Target Down! GO!', 500, '现场', null, false, function () {
        $('#win_1 .window_content').append(make_cross('#win_1 #enemy_0'));
    });
    c.load('', 500, null, null, false, function () {
        play_sound('boli', 0.2);
        play_sound('guns', 0.1);
        $('#win_1 #police_0').animate({
            top: '85px',
        }, 500, 'linear');
        $('#win_1 #police_1').animate({
            top: '80px',
            left: '48px'
        }, 500, 'linear');
        $('#win_1 #police_2').animate({
            left: '255px'
        }, 500, 'linear');
        $('#win_1 #police_3').animate({
            left: '255px'
        }, 500, 'linear', function () {
            $('#win_1 .window_content').append(make_cross('#win_1 #enemy_1'));
            c.load('4队安全', null, '现场');
            c.load('人质安全', null, '现场');
            $('#win_1 #police_0').animate({
                left: '90px',
                top: '87px'
            }, 1000, 'linear');
            $('#win_1 #police_1').animate({
                left: '100px',
                top: '85px'
            }, 1000, 'linear');
            $('#win_1 #police_2').animate({
                left: '245px',
                top: '80px'
            }, 1000, 'linear');
            $('#win_1 #police_3').animate({
                left: '230px',
                top: '85px'
            }, 1000, 'linear', function () {
                $('#win_1 #police_0').animate({
                    left: '130px',
                }, 2000, 'linear');
                $('#win_1 #police_1').animate({
                    left: '150px',
                }, 2000, 'linear');
                $('#win_1 #police_2').animate({
                    left: '200px',
                    top: '85px'
                }, 2000, 'linear');
                $('#win_1 #police_3').animate({
                    left: '180px',
                    top: '100px'
                }, 2000, 'linear');
                $('#win_0 #police_0').animate({
                    top: '105px',
                    left: '90px'
                }, 2000, 'linear');
                $('#win_0 #police_1').animate({
                    top: '115px',
                    left: '80px'
                }, 2000, 'linear');
                $('#win_0 #police_2').animate({
                    top: '125px',
                    left: '70px'
                }, 2000, 'linear');
                $('#win_0 #police_3').animate({
                    top: '80px',
                    left: '190px'
                }, 2000, 'linear');
                $('#win_0 #police_4').animate({
                    top: '80px',
                    left: '210px'
                }, 2000, 'linear');
                $('#win_0 #police_5').animate({
                    top: '80px',
                    left: '230px'
                }, 2000, 'linear');
                play_sound('wuxiandian_voice', 0.1);
                play_sound('wuxiandian_noisey', 0.1);
                c.load('所有劫匪击倒，人质安全，任务完成', null, '现场');
                c.load('', null, null, null, false, function () {
                    main_one_6();
                })
            });
            $('#win_1 #enemy_2').animate({
                top: '100px'
            }, 500, 'linear', function () {
                $('#win_1 .window_content').append(make_cross('#win_1 #enemy_2'));
                c.load('3队安全', null, '现场');
            });
        });
        $('#win_0 #police_0').animate({
            top: '105px',
            left: '55px'
        }, 500, 'linear');
        $('#win_0 #police_1').animate({
            top: '110px',
            left: '50px'
        }, 500, 'linear');
        $('#win_0 #police_2').animate({
            top: '105px',
            left: '45px'
        }, 500, 'linear');
        $('#win_0 #police_3').animate({
            top: '50px',
            left: '240px'
        }, 500, 'linear');
        $('#win_0 #police_4').animate({
            top: '50px',
            left: '250px'
        }, 500, 'linear');
        $('#win_0 #police_5').animate({
            left: '240px'
        }, 500, 'linear', function () {
            $('#win_0 .window_content').append(make_cross('#win_0 #enemy_0'));
            $('#win_0 .window_content').append(make_cross('#win_0 #enemy_1'));
            $('#win_0 .window_content').append(make_cross('#win_0 #enemy_2'));
            $('#win_0 .window_content').append(make_cross('#win_0 #enemy_3'));
            c.load('1队安全', null, '现场');
            c.load('2队安全', null, '现场');
        });
    });
}