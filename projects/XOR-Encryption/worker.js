self.onmessage = function (e) {
    switch (e.data.type) {
        case 'encrypt':
            var { key, data, name } = e.data;
            data = new Uint8Array(data); // 将数据转为 Uint8Array
            var result = data;
            var trunkSize = Math.ceil(data.length / 1000); // 分块（触发进度报告）大小
            key = enhanceKey(key, data.length); // 增强密钥
            // 异或运算
            data.forEach(function (item, index) {
                result[index] = item ^ key[index % key.length];
                if(index % trunkSize == 0){
                    // 发送进度信息
                    self.postMessage({
                        type: 'progress',
                        name: name,
                        progress: (index / data.length * 100).toFixed(2)
                    });
                }
            });
            self.postMessage({
                type: 'encrypt',
                data: result,
                name: name
            });
            break;
        default:
            break;
    }
}
// 增强密钥
function enhanceKey(key, length) {
    // 将每个字符编码相加，作为校验层
    var sum = 0;
    for (var i = 0; i < key.length; i++) {
        sum += key.charCodeAt(i);
    }
    sum = sum.toString().split('').reverse().join(''); // 反转校验层字符串
    sum = new Uint8Array(new TextEncoder().encode(sum).buffer);
    // 拆分密钥
    var keyHead = new Uint8Array(new TextEncoder().encode(key.slice(0, length)).buffer);
    var keyTail = new Uint8Array(new TextEncoder().encode(key.slice(length)).buffer);
    var result = new Uint8Array(new TextEncoder().encode(key.slice(0, length)).buffer);
    // 异或运算
    for (var i = 0; i < keyTail.length; i++) {
        result[i % keyHead.length] = keyHead[i % keyHead.length] ^ keyTail[i];
    }
    // 覆盖校验层
    for (var i = 0; i < result.length; i++) {
        result[i] = result[i] ^ sum[i % sum.length];
    }
    return result;
}