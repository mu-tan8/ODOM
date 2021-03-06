//
//	ODOM [Object to DOM]
//
//				created by mu-tan8(theta)
//				copyright(C) 2015 mu-tan8(theta)
//
//	elements = [{'tagName':'element1',},{'tagName':'element2','attributes':{/*	element2_attribute	*/},'elements':[{/*	element2_children	*/}],text:'text'},];	/*	ordinary elements. required a tagName.	*/
//	attributes = {'attribute1_name':'attribute1_value','attribute2_name':'attribute2_value',};	/*	has attributes only. don't nesting	*/
//	text = 'plain text strings';	/*	has text only. don't nesting	*/
//
//

/*

var object = {
	'elements':[{
		'tagName':'html',
		'attributes':{
			'lang':'ja'
		},
		'elements':[
		{
			'tagName':'head',
			'elements':[{
				'tagName':'title',
				'text':'sample'
			}]
		},
		{
			'tagName':'body',
			'elements':[{
				'tagName':'p',
				'text':'test'
			}]
		}
		]
	}]
};


object to DOM exsample.

	ODOMObject = new ODOM(object);
	DOMNodes = object.toDOM() || object.toDOM(document);
	DOMStrings = object.toDOMString() || object.toDOMString(document);

___output___
<html lang="ja"><head><title>sample</title></head><body><p>test</p></body></html>

*/


var ODOM = function (myObject){

/*	(ODOMObject) = new ODOM(object);	*/
 
	var flag = (function(obj){	//	ODOM Object construct validater

		for (var p in obj){

			var prop = obj[p];

			switch (p){
				case 'elements' :
					if (!prop.length){return 'invalid elements property'};
					for (var i = 0;i < prop.length;i++){
						if (prop[i].tagName){
							return arguments.callee(prop[i]);
						}else{
							return 'invalid element name ';
						};
					}
					break;
				case 'attributes' :
					if (!obj.tagName){return 'invalid object construct'};
					for (var a in prop){
						switch (a){
							case 'elements' :
								return 'invalid object construct';
								break;
							default :
								if (!isNaN(a)){
									return 'invalid attribute name';
								}
								break;
						}
						a = null;
					}
					break;
				case 'text' :
					break;
				default :
					break;
			}
			p = prop = null;
		}

	})(myObject);

	if (flag){
		var e = new Error(flag);
		e.name = 'ODOMError';
		throw e;
	}

	this.elements = myObject.elements;

}

//	ODOM.toDOM() Method
/*	(DOMObject) = ODOM.toDOM(documentObject);	*/

Object.prototype.toDOM = function (oDocument){

	oDocument = oDocument || document;

	if (!oDocument['createElement']){
		return false;
	}
	var oRoot = oDocument.createElement('div');
	var test = ['appendChild','setAttribute','childNodes'];
	for (var i = 0;i < test.length;i++){
		if (!oRoot[test[i]]){
			return false;
		}
	}
	test = null;

	(function (obj , oParentNode){
		for (var p in obj){
			var prop = obj[p];
			switch (p){
				case 'elements' :
					for (var i = 0;i < prop.length;i++){
						if (isNaN(prop[i].tagName)){
							var oChildNode = oParentNode.appendChild(oDocument.createElement(prop[i].tagName));
							arguments.callee(prop[i] , oChildNode);
							oChildNode = null;
						}
					}
					break;
				case 'attributes' :
					for (var a in prop){
						if (isNaN(a) && prop[a]){
							oParentNode.setAttribute(a , prop[a]);
							a = null;
						}
					}
					break;
				case 'text' :
					oParentNode.appendChild(oDocument.createTextNode(prop));
					break;
				default :
					break;
			}
			prop = p = null;
		}
	})(this , oRoot);

	return oRoot.childNodes;
};

//	ODOM.toDOMString() Method
/*	(DOMString) = ODOM.toDOMString(documentObject);	*/

Object.prototype.toDOMString = function (oDocument){

	oDocument = oDocument || document;

	var oRoot = document.createElement('div');

	var fragment = this.toDOM(oDocument);
	if (!fragment.length){
		return false;
	}

	for (var i = 0;i < fragment.length;i++){
		oRoot.appendChild(fragment[i]);
	}

	fragment = null;

	return oRoot.innerHTML;
}

