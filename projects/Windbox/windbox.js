// 定义需要用到的变量
windboxes = [];
currentID = 0;
currentZIndex = 10000;
var currentURL;
floatLayer = document.querySelector(".float-layer");
startMenuOverlay = document.querySelector(".start-menu-overlay");
startMenu = document.querySelector(".start-menu");
taskbar = document.querySelector(".taskbar-btns");
drawer = document.querySelector(".drawer");
drawerOverlay = document.querySelector(".drawer-overlay");
drawerContainer = document.querySelector(".drawer-container");
drawerTitle = document.querySelector(".drawer-title");
drawerContent = document.querySelector(".drawer-content");
shortcutArea = document.querySelector(".shortcuts");
notification = document.querySelector(".notification");
notificationTitle = document.querySelector(".notification-title");
notificationContent = document.querySelector(".notification-content");
// 生成窗口
function windbox_generate(URL, icon, title, background, color, splashImg = icon) {
    // 写入窗口列表
    windboxes.push(currentID);
    // 取出当前 ID
    var ID = currentID;
    // 创建窗口元素并将其初始化
    var windbox = document.createElement("div");
    windbox.classList.add("windbox");
    windbox.id = "windbox_" + ID;
    windbox.innerHTML = `<div class="windbox-titlebar" id="titlebar_` + ID + `">
        <div class="windbox-icon">
            <img src="`+ icon + `">
        </div>
        <div class="windbox-title" id="title_`+ ID + `">` + title + `</div>
        <div class="windbox-actions">
            <div class="windbox-action-normal" onclick="windbox_minimise(`+ ID + `);">
                <div class="windbox-action-icon">🗕</div>
            </div>
            <div class="windbox-action-normal" onclick="windbox_maximise(`+ ID + `, 'T');">
                <div class="windbox-action-icon" id="maxIcon_`+ ID + `">🗖</div>
            </div>
            <div class="windbox-action-close" onclick="windbox_destroy(`+ ID + `);">
                <div class="windbox-action-icon">🗙</div>
            </div>
        </div>
    </div>
    <div class="windbox-splash-layer" style="background: `+ background + `;">
        <img src="`+ splashImg + `">
    </div>
    <iframe class="windbox-iframe" id="iframe_` + ID + `"></iframe>
    <div class="drag-overlay" id="dragOverlay_`+ ID + `"></div>`;
    document.body.appendChild(windbox);
    // 创建任务栏图标元素并将其初始化
    var taskbarBtn = document.createElement("div");
    taskbarBtn.classList.add("taskbar-btn");
    taskbarBtn.id = "taskbarBtn_" + ID;
    taskbarBtn.onclick = function () {
        windbox_toggle(ID);
    };
    taskbarBtn.innerHTML = `<img src="` + icon + `">`;
    taskbar.appendChild(taskbarBtn);
    // 取出需要用到的元素
    var dragOverlay = document.querySelector("#dragOverlay_" + ID);
    var titlebar = document.querySelector("#titlebar_" + ID);
    var dragTitle = document.querySelector("#title_" + ID);
    var iframe = document.querySelector("#iframe_" + ID);
    // 鼠标/触摸按下，准备拖拽窗口
    dragTitle.addEventListener("mousedown", windbox_mousedown);
    dragTitle.addEventListener("touchstart", windbox_mousedown);
    function windbox_mousedown(e) {
        e.preventDefault();
        maximiseAction = "none";
        if (e.type == "touchstart") {
            e = e.touches[0];
        }
        let x = e.pageX - windbox.offsetLeft;
        let y = e.pageY - windbox.offsetTop;
        // 窗口跟随鼠标/触摸移动
        document.addEventListener("mousemove", windbox_mousemove);
        document.addEventListener("touchmove", windbox_mousemove);
        function windbox_mousemove(e) {
            if (e.type == "touchmove") {
                e = e.touches[0];
            }
            // 防止拖拽时卡住
            dragOverlay.style.pointerEvents = "all";
            // 移除贴靠状态
            var maximiseActions = ["T", "LT", "LB", "L", "RT", "RB", "R"];
            maximiseActions.forEach(function (action) {
                if (windbox.classList.contains("windbox-maximised-" + action)) {
                    windbox.style.transitionProperty = "transform, width, height, opacity, box-shadow";
                    windbox.classList.remove("windbox-maximised-" + action);
                    x = windbox.clientWidth / 2;
                    document.querySelector("#maxIcon_" + ID).innerHTML = "🗖";
                }
            });
            // 准备贴靠窗口
            if (e.clientX <= 16) {
                if (e.clientY <= 16) {
                    maximiseAction = "LT";
                    floatLayer.style.width = "50%";
                    floatLayer.style.height = "calc(50% - 24px)";
                    floatLayer.style.left = "0";
                    floatLayer.style.top = "0";
                } else if (e.clientY >= window.innerHeight - 64) {
                    maximiseAction = "LB";
                    floatLayer.style.width = "50%";
                    floatLayer.style.height = "calc(50% - 24px)";
                    floatLayer.style.left = "0";
                    floatLayer.style.top = "calc(50% - 24px)";
                } else {
                    maximiseAction = "L";
                    floatLayer.style.width = "50%";
                    floatLayer.style.height = "calc(100% - 48px)";
                    floatLayer.style.left = "0";
                    floatLayer.style.top = "0";
                }
            } else if (e.clientX >= window.innerWidth - 16) {
                if (e.clientY <= 16) {
                    maximiseAction = "RT";
                    floatLayer.style.width = "50%";
                    floatLayer.style.height = "calc(50% - 24px)";
                    floatLayer.style.left = "50%";
                    floatLayer.style.top = "0";
                } else if (e.clientY >= window.innerHeight - 64) {
                    maximiseAction = "RB";
                    floatLayer.style.width = "50%";
                    floatLayer.style.height = "calc(50% - 24px)";
                    floatLayer.style.left = "50%";
                    floatLayer.style.top = "calc(50% - 24px)";
                } else {
                    maximiseAction = "R";
                    floatLayer.style.width = "50%";
                    floatLayer.style.height = "calc(100% - 48px)";
                    floatLayer.style.left = "50%";
                    floatLayer.style.top = "0";
                }
            } else if (e.clientY <= 16) {
                maximiseAction = "T";
                floatLayer.style.width = "100%";
                floatLayer.style.height = "calc(100% - 48px)";
                floatLayer.style.left = "0";
                floatLayer.style.top = "0";
            } else {
                maximiseAction = "none";
                floatLayer.style.width = "0";
                floatLayer.style.height = "0";
                floatLayer.style.left = "50%";
                floatLayer.style.top = "calc(50% - 24px)";
            }
            if (e.clientY < window.innerHeight - 48) {
                windbox.style.left = e.pageX - x + 'px';
                windbox.style.top = e.pageY - y + 'px';
            }
        }
        // 鼠标/触摸抬起，解除监听
        document.addEventListener("mouseup", windbox_mouseup);
        document.addEventListener("touchend", windbox_mouseup);
        function windbox_mouseup(e) {
            dragOverlay.style.pointerEvents = "none";
            document.removeEventListener("mousemove", windbox_mousemove);
            document.removeEventListener("touchmove", windbox_mousemove);
            if (maximiseAction != "none") {
                // 进行窗口贴靠
                windbox_maximise(ID, maximiseAction);
            }
            window.setTimeout(function () {
                // 隐藏贴靠预览层
                floatLayer.style.width = "0";
                floatLayer.style.height = "0";
                floatLayer.style.left = "50%";
                floatLayer.style.top = "calc(50% - 24px)";
            }, 500);
            document.removeEventListener("mouseup", windbox_mouseup);
            document.removeEventListener("touchend", windbox_mouseup);
        }
    }
    // 激活窗口
    windbox_activate(ID);
    windbox.addEventListener("mousedown", function () {
        // 调整动画属性，防止窗口拖拽有延迟
        windbox.style.transitionProperty = "transform, opacity, box-shadow";
        windbox_activate(ID);
    });
    windbox.addEventListener("touchstart", function () {
        // 调整动画属性，防止窗口拖拽有延迟
        windbox.style.transitionProperty = "transform, opacity, box-shadow";
        windbox_activate(ID);
    });
    // 双击标题栏最大化窗口
    dragTitle.addEventListener("dblclick", function (e) {
        e.preventDefault();
        windbox_maximise(ID, "T");
    });
    // 播放窗口打开动效
    window.setTimeout(function () {
        windbox.classList.add("windbox-opened");
        titlebar.style.transitionDuration = "0s";
        titlebar.style.background = background;
        titlebar.style.color = color;
        window.setTimeout(function () {
            titlebar.style.transitionDuration = "0.2s";
            windbox.querySelector(".windbox-splash-layer").style.opacity = "0";
            titlebar.classList.add("windbox-titlebar-opened");
            window.setTimeout(function () {
                // 销毁窗口启动页元素
                windbox.querySelector(".windbox-splash-layer").remove();
            }, 200);
        }, 1000);
        // 延迟加载 iframe 以提高动画流畅度
        window.setTimeout(function () {
            iframe.src = URL;
        }, 500);
    }, 0);
    // 播放任务栏图标新增动效
    window.setTimeout(function () {
        taskbarBtn.classList.add("taskbar-btn-opened");
    }, 0);
    // 触摸优化
    touchOptimise();
    // 窗口编号递增
    currentID++;
}

// 销毁指定窗口
function windbox_destroy(ID) {
    var windbox = document.querySelector("#windbox_" + ID);
    // 播放窗口关闭动效
    windbox.classList.remove("windbox-opened");
    window.setTimeout(function () {
        // 销毁窗口元素
        windbox.remove();
    }, 500);
    var taskbarBtn = document.querySelector("#taskbarBtn_" + ID);
    // 播放任务栏图标移除动效
    taskbarBtn.classList.remove("taskbar-btn-opened");
    window.setTimeout(function () {
        // 销毁任务栏图标元素
        taskbarBtn.remove();
    }, 100);
    // 从窗口列表中移除编号
    windboxes.splice(windboxes.indexOf(ID), 1);
}

// 销毁所有窗口
function windbox_destroyAll() {
    // 将上面各个操作分开执行，以防止有窗口遗漏
    windboxes.forEach(function (ID) {
        document.querySelector("#windbox_" + ID).classList.remove("windbox-opened");
    });
    window.setTimeout(function () {
        windboxes.forEach(function (ID) {
            document.querySelector("#windbox_" + ID).remove();
        });
        windboxes = [];
    }, 500);
    windboxes.forEach(function (ID) {
        document.querySelector("#taskbarBtn_" + ID).classList.remove("taskbar-btn-opened");
    });
    window.setTimeout(function () {
        windboxes.forEach(function (ID) {
            document.querySelector("#taskbarBtn_" + ID).remove();
        });
    }, 100);
    drawer_toggle();
}

// 激活指定窗口
function windbox_activate(ID) {
    // 窗口Z轴高度递增
    currentZIndex++;
    var windbox = document.querySelector("#windbox_" + ID);
    // 将该窗口置于其他窗口之上，同时设置各元素的Z轴高度以防止遮挡
    windbox.style.zIndex = currentZIndex;
    floatLayer.style.zIndex = currentZIndex;
    startMenuOverlay.style.zIndex = currentZIndex + 1;
    startMenu.style.zIndex = currentZIndex + 2;
    document.querySelector(".taskbar").style.zIndex = currentZIndex + 3;
    notification.style.zIndex = currentZIndex + 4;
    drawerOverlay.style.zIndex = currentZIndex + 5;
    drawer.style.zIndex = currentZIndex + 6;
    // 为窗口添加激活样式
    windbox.classList.remove("windbox-inactive");
    document.querySelector("#dragOverlay_" + ID).style.pointerEvents = "none";
    // 为任务栏图标添加激活样式
    document.querySelector("#taskbarBtn_" + ID).classList.add("taskbar-btn-active");
    // 为其他窗口和任务栏图标移除激活样式
    windboxes.forEach(function (item) {
        if (item != ID) {
            document.querySelector("#windbox_" + item).classList.add("windbox-inactive");
            document.querySelector("#dragOverlay_" + item).style.pointerEvents = "all";
            document.querySelector("#taskbarBtn_" + item).classList.remove("taskbar-btn-active");
        }
    })
}

// 使指定窗口失去激活状态
function windbox_inactivate(ID) {
    var windbox = document.querySelector("#windbox_" + ID);
    windbox.classList.add("windbox-inactive");
    document.querySelector("#dragOverlay_" + ID).style.pointerEvents = "all";
    document.querySelector("#taskbarBtn_" + ID).classList.remove("taskbar-btn-active");
}

// 最大化指定窗口
function windbox_maximise(ID, action) {
    var windbox = document.querySelector("#windbox_" + ID);
    var maxIcon = document.querySelector("#maxIcon_" + ID);
    windbox.style.transitionProperty = "transform, width, height, left, top, opacity, box-shadow";
    // 为窗口添加最大化样式
    windbox.classList.toggle("windbox-maximised-" + action);
    if (windbox.classList.contains("windbox-maximised-T")) {
        // 提高顶部贴靠的优先级
        var maximiseActions = ["LT", "LB", "L", "RT", "RB", "R"];
        maximiseActions.forEach(function (action) {
            windbox.classList.remove("windbox-maximised-" + action);
        });
        maxIcon.innerHTML = "🗗";
    } else {
        maxIcon.innerHTML = "🗖";
    }
}

// 最小化指定窗口
function windbox_minimise(ID) {
    var windbox = document.querySelector("#windbox_" + ID);
    windbox.style.transitionProperty = "transform, width, height, left, top, opacity, transform-origin, box-shadow";
    // 为窗口添加最小化样式
    windbox.classList.add("windbox-minimised");
    // 使窗口失去激活状态
    windbox_inactivate(ID);
}

// 最小化所有窗口
function windbox_minimiseAll() {
    windboxes.forEach(function (ID) {
        windbox_minimise(ID);
    });
}

// 还原指定窗口
function windbox_restore(ID) {
    var windbox = document.querySelector("#windbox_" + ID);
    // 移除窗口的最小化样式
    windbox.classList.remove("windbox-minimised");
    // 激活窗口
    windbox_activate(ID);
}

// 还原所有窗口
function windbox_restoreAll() {
    windboxes.forEach(function (ID) {
        windbox_restore(ID);
    });
}

// 切换指定窗口的最小化和激活状态
function windbox_toggle(ID) {
    var windbox = document.querySelector("#windbox_" + ID);
    // 如果窗口处于最小化状态
    if (windbox.classList.contains("windbox-minimised")) {
        // 还原窗口
        windbox_restore(ID);
    } else {
        // 如果窗口正常显示
        if (windbox.style.zIndex == currentZIndex) {
            // 窗口已激活时最小化窗口
            windbox_minimise(ID);
        } else {
            // 窗口未激活时激活窗口
            windbox_activate(ID);
        }
    }
}

// 切换开始菜单打开状态
function startMenu_toggle() {
    // 切换开始菜单打开样式
    startMenu.classList.toggle("start-menu-opened");
    // 切换开始菜单遮罩层状态和开始菜单图标激活样式
    if (startMenu.classList.contains("start-menu-opened")) {
        startMenuOverlay.style.pointerEvents = "all";
        document.querySelector(".start-menu-trigger").classList.add("taskbar-btn-active");
    } else {
        startMenuOverlay.style.pointerEvents = "none";
        document.querySelector(".start-menu-trigger").classList.remove("taskbar-btn-active");
    }
}

// 切换抽屉栏打开状态
function drawer_toggle() {
    // 切换抽屉栏打开样式
    drawer.classList.toggle("drawer-opened");
    // 切换抽屉栏遮罩层状态和开始菜单图标激活样式
    if (drawer.classList.contains("drawer-opened")) {
        drawerOverlay.style.pointerEvents = "all";
    } else {
        drawerOverlay.style.pointerEvents = "none";
    }
}

// 初始化抽屉栏内容
function drawer_initialize(title, content, delay = 400) {
    drawerContainer.style.transitionDuration = "0s";
    drawerContainer.style.transform = "translateX(-50%)";
    // 销毁抽屉栏原有内容，并将新内容添加到抽屉栏
    drawerTitle.innerHTML = title;
    drawerContent.innerHTML = content;
    window.setTimeout(function () {
        // 播放抽屉栏展开动效
        drawer_toggle();
        drawerContainer.style.transitionDuration = "0.6s";
        drawerContainer.style.transform = "translateX(0)";
    }, delay);
    // 初始化抽屉栏元素
    drawer_listen();
    // 优化触摸
    touchOptimise();
}

// 载入快捷方式
function shortcut_load() {
    // 销毁快捷方式区域原有内容
    shortcutArea.innerHTML = "";
    // 初始化序号
    var index = 0;
    // 生成快捷方式图标
    function shortcut_generateIcon(shortcutArray, removable = true) {
        shortcutArray.forEach(function (item, index_1) {
            var shortcutItem = document.createElement("div");
            shortcutItem.classList.add("shortcut");
            // 使快捷方式支持 :focus 选择器
            shortcutItem.tabIndex = index;
            shortcutItem.innerHTML = `<img src="` + item.icon + `">
            <div class="shortcut-title">`+ item.title + `</div>`;
            // 双击快捷方式打开窗口
            shortcutItem.addEventListener("dblclick", function (e) {
                e.preventDefault();
                windbox_generate(item.URL, item.icon, item.title, item.background, item.color);
            });
            // 按下回车键打开窗口
            shortcutItem.addEventListener("keydown", function (e) {
                if (e.key == "Enter") {
                    windbox_generate(item.URL, item.icon, item.title, item.background, item.color);
                }
            });
            // 右键单击删除快捷方式
            shortcutItem.addEventListener("contextmenu", function (e) {
                e.preventDefault();
                if (removable) {
                    drawerContent_DeleteShortcut = "确定要删除快捷方式“" + item.title + "”吗？<br><br>此操作无法撤销。<br><br><button class='drawer-btn' onclick='shortcut_delete_byBtn(" + index_1 + ");' style='float: right;'>确定</button>";
                    drawer_initialize(drawerTitle_DeleteShortcut, drawerContent_DeleteShortcut, 0);
                }
            });
            shortcutArea.appendChild(shortcutItem);
            index++;
        });
    }
    // 载入默认快捷方式
    shortcut_generateIcon(defaultShortcuts, false);
    // 如果本地存储中存在快捷方式数据
    if (localStorage.shortcuts) {
        // 从本地存储中取出快捷方式并显示在桌面上
        shortcuts = JSON.parse(localStorage.getItem("shortcuts"));
        shortcut_generateIcon(shortcuts);
    } else {
        // 如果本地存储中不存在快捷方式数据，则初始化快捷方式数组为空数组
        shortcuts = [];
    }
}

// 创建快捷方式
function shortcut_create(URL, icon, title, background, color) {
    // 将新的快捷方式对象添加到快捷方式数组中
    shortcuts.push({
        URL: URL,
        icon: icon,
        title: title,
        background: background,
        color: color
    });
    // 将更新后的快捷方式数组存储到本地存储中
    localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
    // 重新加载快捷方式
    shortcut_load();
}

function shortcut_create_byBtn() {
    // 获取输入字段
    var URL = document.querySelector("#shortcutInput_URL");
    var icon = document.querySelector("#shortcutInput_Icon");
    var title = document.querySelector("#shortcutInput_Title");
    var background = document.querySelector("#shortcutInput_Bg");
    var color = document.querySelector("#shortcutInput_Color");
    // 检查所有字段是否都已填写
    if (URL.value != "" && icon.value != "" && title.value != "" && background.value != "" && color.value != "") {
        // 创建一个新的快捷方式
        shortcut_create(URL.value, icon.value, title.value, background.value, color.value);
        // 重置输入字段
        URL.value = "";
        icon.value = "";
        title.value = "";
        background.value = "#1565C0";
        color.value = "#ffffff";
        // 关闭抽屉栏
        drawer_toggle();
    } else {
        // 如果输入字段的值为空，则显示错误提示
        notification_show("无效输入", "文本框中的内容不能为空。");
    }
}

// 删除指定快捷方式
function shortcut_delete(ID) {
    // 从快捷方式数组中删除该元素
    shortcuts.splice(ID, 1);
    // 将更新后的快捷方式数组存储到本地存储中
    localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
    // 重新加载快捷方式
    shortcut_load();
}

function shortcut_delete_byBtn(ID) {
    shortcut_delete(ID);
    // 关闭抽屉栏
    drawer_toggle();
}

// 载入深色主题设置
function darkTheme_load() {
    // 检查浏览器的深色主题设置
    function darkTheme_detect() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add("body-dark");
        } else {
            document.body.classList.remove("body-dark");
        }
    }
    darkTheme_detect();
    // 监听浏览器深色主题设置变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", function () {
        darkTheme_detect();
    });
}

// 切换深色主题
function darkTheme_toggle() {
    document.body.classList.toggle("body-dark");
}

// 关闭当前标签页
function leavePage() {
    if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) {
        window.location.href = "about:blank";
        window.close();
    } else {
        window.opener = null;
        window.open("", "_self");
        window.close();
    }
}

// 更新任务栏日期和时间
function taskbarDate_update() {
    // 获取当前日期和时间
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    // 数字小于 10 补 0
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    // 更新任务栏上的日期和时间显示
    document.querySelector(".taskbar-date").innerHTML = hours + ":" + minutes + "<br>" + year + "-" + month + "-" + day;
}

// 载入桌面背景
function bg_load() {
    // 检查本地存储中是否存在背景图片的 URL
    if (localStorage.bg) {
        // 如果存在，则使用该 URL 设置背景图片
        document.body.style.backgroundImage = "url('" + localStorage.getItem("bg") + "')";
    } else {
        // 如果不存在，则自动设置默认的背景图片
        bg_set("https://api.kdcc.cn/");
    }
}

// 设置桌面背景
function bg_set(URL) {
    // 将背景图片的 URL 存储到本地存储中
    localStorage.setItem("bg", URL);
    // 重新载入桌面背景
    bg_load();
}

function bg_set_byBtn(reset = false) {
    // 获取输入字段
    var bgInput = document.querySelector("#bgInput");
    // 重置桌面背景
    if (reset) {
        document.querySelector("#bgInput").value = "https://api.kdcc.cn/";
    }
    if (bgInput.value != "") {
        // 如果输入字段的值不为空，则设置背景图片，清空文本框，关闭抽屉栏
        bg_set(document.querySelector("#bgInput").value);
        document.querySelector("#bgInput").value = "";
        drawer_toggle();
    } else {
        // 如果输入字段的值为空，则显示错误提示
        notification_show("无效输入", "文本框中的内容不能为空。");
    }
}

// 显示通知
function notification_show(title, content, delay = 7000, action = function () { }) {
    // 初始化通知元素
    try {
        window.clearTimeout(notificationTimer);
    } catch (error) { }
    notification.onclick = function () {
        action();
        notification_hide();
    };
    notification.style.transitionDuration = "0s";
    notification.classList.remove("notification-opened");
    notificationTitle.innerHTML = title;
    notificationContent.innerHTML = content;
    // 防止通知动效消失
    window.setTimeout(function () {
        notification.style.transitionDuration = "0.5s, 0.1s";
        notification.classList.add("notification-opened");
    }, 10);
    notificationTimer = window.setTimeout(notification_hide, delay)
}

// 隐藏通知
function notification_hide() {
    notification.classList.remove("notification-opened");
}

// 监听网络状态变化
function listenNetworkChange() {
    window.addEventListener("online", function () {
        notification_show("网络连接已恢复", "所有功能已恢复正常。");
    });
    window.addEventListener("offline", function () {
        notification_show("网络连接已断开", "页面可能无法正常载入。");
    });
}

// 显示欢迎消息
function showWelcomeMsg() {
    if (!localStorage.welcomed) {
        notification_show("欢迎使用 Windbox", "点击此通知以了解有关 Windbox 的更多信息。<br><br>此项目绝不附属于 Microsoft，且不应与 Microsoft 的产品相混淆，这也不是 Windows 365 Cloud PC。", 10000, function () {
            windbox_generate("Applications/Welcome/index.html?ver=1", "favicon.png", "欢迎 - Windbox", "#1565C0", "#ffffff");
            localStorage.setItem("welcomed", true);
        });
    }
}

// 触摸优化
function touchOptimise() {
    var touchElements = ["windbox-action-normal", "windbox-action-close", "taskbar-btn", "start-menu-item", "drawer-link", "drawer-btn", "notification"];
    var touchDelay = [0, 0, 100, 0, 0, 100, 100];
    touchElements.forEach(function (item, delayIndex) {
        document.querySelectorAll("." + item).forEach(function (itemObj) {
            itemObj.ontouchstart = function () {
                itemObj.classList.add(item + "-touched");
            }
            itemObj.ontouchend = function () {
                window.setTimeout(function () {
                    itemObj.classList.remove(item + "-touched");
                }, touchDelay[delayIndex]);
            }
        });
    });
}

// 页面载入完成后执行
window.onload = function () {
    taskbarDate_update();
    window.setInterval(taskbarDate_update, 1000);
    bg_load();
    shortcut_load();
    darkTheme_load();
    listenNetworkChange();
    showWelcomeMsg();
    touchOptimise();
}

// 为抽屉栏内容创建元素
drawerTitle_About = "关于 Windbox";
drawerContent_About = "这是一个运行于浏览器端的轻量级桌面环境，以 iframe 的形式将网页呈现在窗口中，实现类似 Windows 的使用体验。建议全屏使用。<br><br>-将窗口拖动到页面边缘处，以进行窗口贴靠（共 7 种贴靠方式）。<br>-手动创建快捷方式后，右键单击它可将其删除。<br>-深色主题优先跟随浏览器设置，也可自行切换。<br>-请注意，某些网页屏蔽了 iframe 嵌套请求，因此无法正常显示。<br>-出于安全考虑，跨域 iframe 的 URL 无法被获取，创建快捷方式需要手动填写数据。<br><br>Made by Burger Studio.<br>在 GitHub 中查看：<a class='drawer-link' href='https://github.com/BGStudio2021/Windbox'>BGStudio2021/Windbox</a><br><br>此项目绝不附属于 Microsoft，且不应与 Microsoft 的产品相混淆，这也不是 Windows 365 Cloud PC。";
drawerTitle_Bg = "更改桌面背景";
drawerContent_Bg = "由于浏览器本地存储空间有限，暂时不支持从本地选择图片。<br><br>桌面背景图片 URL：<br><input type='url' id='bgInput' placeholder='输入 URL'><button class='drawer-btn' onclick='bg_set_byBtn(true);'>重置</button><button class='drawer-btn' onclick='bg_set_byBtn();' style='float: right;'>更改</button>";
drawerTitle_DestroyAll = "关闭所有窗口";
drawerContent_DestroyAll = "一旦关闭所有窗口，您未保存的内容将会丢失。<br><br>确定要关闭所有窗口吗？<br><br><button class='drawer-btn' onclick='windbox_destroyAll();' style='float: right;'>确定</button>";
drawerTitle_LeavePage = "关闭标签页";
drawerContent_LeavePage = "一旦关闭标签页，您未保存的内容将会丢失。<br><br>确定要关闭标签页吗？<br><br><button class='drawer-btn' onclick='leavePage();' style='float: right;'>确定</button>";
drawerTitle_CreateShortcut = "创建快捷方式";
drawerContent_CreateShortcut = `在桌面创建页面的快捷方式，以便日后使用。<br><br>请填写必要的信息：<br>
<form onsubmit='return false;'>
<input type='url' id='shortcutInput_URL' placeholder='页面 URL'>
<input type='url' id='shortcutInput_Icon' placeholder='图标 URL'>
<input type='text' id='shortcutInput_Title' placeholder='标题'>
启动页背景色：<input type='color' id='shortcutInput_Bg' placeholder='启动页背景色' value='#1565C0'>
启动页文本色：<input type='color' id='shortcutInput_Color' placeholder='启动页文本色' value='#ffffff'>
</form>
<button class='drawer-btn' onclick='shortcut_create_byBtn();' style='float: right;'>创建</button>`;
drawerTitle_DeleteShortcut = "删除快捷方式";
drawerContent_DeleteShortcut = "删除已创建的快捷方式。<br><br>";

// 初始化抽屉栏元素
// 包括回车键监听、自动聚焦文本框等
function drawer_listen() {
    // 由于不确定抽屉栏中具体内容，使用 try-catch 语句避免报错
    try {
        document.querySelector("#bgInput").addEventListener("keydown", function (e) {
            if (e.keyCode == 13) {
                bg_set_byBtn();
            }
        });
        document.querySelector("#bgInput").focus();
    } catch (error) { }
    try {
        document.querySelector("#shortcutInput_URL").addEventListener("keydown", function (e) {
            if (e.keyCode == 13) {
                document.querySelector("#shortcutInput_Icon").focus();
            }
        });
        document.querySelector("#shortcutInput_Icon").addEventListener("keydown", function (e) {
            if (e.keyCode == 13) {
                document.querySelector("#shortcutInput_Title").focus();
            }
        });
        document.querySelector("#shortcutInput_Title").addEventListener("keydown", function (e) {
            if (e.keyCode == 13) {
                shortcut_create_byBtn();
            }
        });
        document.querySelector("#shortcutInput_URL").focus();
    } catch (error) { }
}

// 默认快捷方式
defaultShortcuts = [{
    URL: "Applications/Welcome/index.html?ver=1",
    icon: "favicon.png",
    title: "欢迎",
    background: "#1565C0",
    color: "#ffffff"
}, {
    URL: "Applications/Blessing-2025/index.html?ver=1",
    icon: "favicon.png",
    title: "新年祝福语",
    background: "#1565C0",
    color: "#ffffff"
}];