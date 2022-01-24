import Vue from 'vue'
/**
 * 通用js方法封装处理
 */

const baseURL = process.env.VUE_APP_BASE_API

// 日期格式化
export function parseTime(time: any, pattern: any) {
	console.log(time);
	
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		} else if (typeof time === 'string') {
			time = time.replace(new RegExp(/-/gm), '/');
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result: any, key: any) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

export function dateFormatISO (ISOdate: any ,fmt = 'YYYY-mm-dd HH:MM:SS') {
	let date = new Date(ISOdate);
	let ret;
	const opt = {
		"Y+": date.getFullYear().toString(),        // 年
		"m+": (date.getMonth() + 1).toString(),     // 月
		"d+": date.getDate().toString(),            // 日
		"H+": date.getHours().toString(),           // 时
		"M+": date.getMinutes().toString(),         // 分
		"S+": date.getSeconds().toString()          // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
}

// 表单重置
export function resetForm(refName: any) {
	let vue = new Vue();
	if (vue.$refs[refName]) {
		vue.$refs[refName]['resetFields']();
	}
}

// 添加日期范围
export function addDateRange(params: any, dateRange: any, propName: any) {
	var search = params;
	if (null != dateRange && '' != dateRange) {
		search.dateRange = {};
		if (typeof(propName) === "undefined") {
			search.dateRange["$gte"] = dateRange[0];
			search.dateRange["$lte"] = dateRange[1];
		} else {
			search.dateRange["begin" + propName] = dateRange[0];
			search.dateRange["end" + propName] = dateRange[1];
		}
	}
	return search;
}

// 回显数据字典
export function selectDictLabel(datas: any, value: any) {
	var actions: any = [];
	Object.keys(datas).some((key) => {
		if (datas[key].dict_value == ('' + value)) {
			actions.push(datas[key].dict_label);
			return true;
		}
	})
	return actions.join('');
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas: any, value: any, separator: any) {
	var actions: any = [];
	var currentSeparator = undefined === separator ? "," : separator;
	var temp = value.split(currentSeparator);
	Object.keys(value.split(currentSeparator)).some((val) => {
		Object.keys(datas).some((key) => {
			if (datas[key].dictValue == ('' + temp[val])) {
				actions.push(datas[key].dictLabel + currentSeparator);
			}
		})
	})
	return actions.join('').substring(0, actions.join('').length - 1);
}

// 通用下载方法
export function download(fileName: any) {
	window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

// 字符串格式化(%s )
export function sprintf(str: any) {
	var args = arguments, flag = true, i = 1;
	str = str.replace(/%s/g, function () {
		var arg = args[i++];
		if (typeof arg === 'undefined') {
			flag = false;
			return '';
		}
		return arg;
	});
	return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str: any) {
	if (!str || str == "undefined" || str == "null") {
		return "";
	}
	return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data: any, id: any, parentId: any, children: any, rootId: any) {
	if (!data || data.length < 0) return [];
	id = id || 'id'
	parentId = parentId || 'parentId'
	children = children || 'children'
	// rootId = rootId || Math.min.apply(Math, data.map((item: any) => { return item[parentId] })) || 0
	//对源数据深度克隆
	const cloneData = JSON.parse(JSON.stringify(data))
	//循环所有项
	const treeData = cloneData.filter((father: any) => {
		let branchArr = cloneData.filter((child: any) => {
			//返回每一项的子级数组
			return father[id] === child[parentId]
		});
		
		branchArr.length > 0 ? father.children = branchArr : [];
		//返回第一层
		
		return !father[parentId]
	});
	
	return treeData != '' ? treeData : data;
}
