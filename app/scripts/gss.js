(function(window, document ) {

	window.gss = { styles : {}, properties : {}, values : {} };

	// Initialize
	var generateSheet = function( suffix, media_queries ){
		var style = document.createElement("style");
		style.id = suffix || 'basic';
		style.type = 'text/css';
		var media = 'all';
		if(media_queries&&media_queries.length>=1){
			media_queries.forEach(function(constraint){
				if(constraint) media += ' and ('+constraint.key+':'+constraint.value+')';
			});
		}
		style.setAttribute("media", media);
		style.appendChild(document.createTextNode(""));
		document.head.appendChild(style);
		window.gss.styles[style.id] = style;

		// var css = 'h1 { background: red; }',
		//   head = document.head || document.getElementsByTagName('head')[0],
		//   style = document.createElement('style');
		// style.type = 'text/css';
		// if (style.styleSheet){
		//   style.styleSheet.cssText = css;
		// } else {
		//   style.appendChild(document.createTextNode(css));
		// }
		// head.appendChild(style);

	};

	// Add Function Section
	var addClassToSheet = function(class_key, property, value, suffix, media_queries){
		if(!(suffix&&suffix.match(/(^(?:NX|NH|X|N)[0-9]+)((?:NX|NH|X|N)[0-9]+)?$/))) suffix = 'basic';
		if(!window.gss.styles[suffix]){ generateSheet(suffix, media_queries); }
		var style = window.gss.styles[suffix] || window.gss.styles['basic'];
		var class_text = '.'+class_key+' {'+property+': '+value+' ;}';
		if(style.innerHTML.indexOf(class_text)==-1){ style.innerHTML += class_text+'\n'; }
		// if('addRule' in sheet) sheet.addRule(selector, rules, index);
		// else if('insertRule' in sheet) sheet.insertRule(selector + "{" + rules + "}", sheet.cssRules.length);
	};

	// Gss Function Section
	var gss = function(target){
		if(typeof target === 'object' && target.nodeType !== 8 ){
			gssElement(target);
			watcher.observe(target, { attributes: true, attributeFilter: ['class'] });
			target.setAttribute('gss','');
			var elements = target.querySelectorAll(':not([gss])');
			elements.forEach(function(element){
				if(typeof element === 'object' && element.nodeType !==8 ){
					gssElement(element);
					watcher.observe(element, { attributes: true, attributeFilter: ['class'] });
					element.setAttribute('gss','');
				}
			});
		}
	};

	var gssElement = function(element) {
		getClassNamesOfElement(element).forEach(function(css_name){
			if(css_name){
				var css = makeClassOfClassName(css_name);
				if(css && css.property && css.value){
					addClassToSheet(css_name, css.property, css.value, css.suffix, css.media_queries);
				}
			}
		});
	};

	// Get Function Section
	var getSuffixFromMediaQuery = function(media_query){
		if(!(media_query.key&&media_query.value)) return null;
		var suffix = '';
		if(media_query.key=='max-width') suffix += 'X';
		else if(media_query.key=='min-width') suffix += 'N';
		else if(media_query.key=='max-height') suffix += 'XH';
		else if(media_query.key=='min-height') suffix += 'NH';
		else return null;
		suffix += media_query.value;
		return suffix;
	};

	var getSuffixFromMediaQueries = function(media_queries){
		var suffix = '';
		media_queries.forEach(function(media_query){
			suffix += getSuffixFromMediaQuery(media_query);
		});
		return suffix;
	};

	var getMediaQueryFromSuffix = function(suffix){
		if(!suffix) return null;
		var media_query = {};
		if(suffix.match(/^NX/)) media_query.key = 'max-height';
		else if(suffix.match(/^NH/)) media_query.key = 'min-height';
		else if(suffix.match(/^X/)) media_query.key = 'max-width';
		else if(suffix.match(/^N/)) media_query.key = 'min-width';
		else return null;
		media_query.value = suffix.match(/[0-9]+$/)[0]+'px';
		media_query.suffix = suffix;
		return media_query;
	};

	var getMediaQueriesFromSuffix = function(suffix){
		var pieces = suffix.match(/(^(?:NX|NH|X|N)[0-9]+)?((?:NX|NH|X|N)[0-9]+)?$/);
		if(!(suffix && pieces && pieces[0] && pieces[0].length && pieces[0].length==suffix.length)) return;
		var media_queries = [];
		for(i=1; i<=pieces.length-1; i++){
			if(pieces[i]){
				var media_query = getMediaQueryFromSuffix(pieces[i]);
				media_queries.push(media_query);
			}
		}
		return media_queries;
	};

	var getClassNamesOfElement = function(element){
		var classNames = element && element.className && element.className.split(' ') || [];
		return classNames;
	};

	var getPropertyOfClassPiece = function(class_piece){
		if(!(class_piece && window.gss.properties[class_piece])) return;
		return window.gss.properties[class_piece];
	};
	
	var getValueOfClassPiece = function(property_obj, class_piece){
		if(!property_obj) return;
		var value = '';
		if(property_obj.value_set&&property_obj.value_set[class_piece]){
			return property_obj.value_set[class_piece];
		}
		if(class_piece.match(/^((\+|\-|D|M)?[0-9_]+(px|vw|s)?)+$/)){
			var pieces = class_piece.match(/(\+|\-|D|M)?([0-9_]+)(px|vw|s)?(?:(\+|\-|D|M)?([0-9_]+)(px|vw|s)?)?(?:(\+|\-|D|M)?([0-9_]+)(px|vw|s)?)?/);
			for(var i=1; i<=pieces.length-1; i++){
				if(i==1) value = 'calc(';
				if(i%3==1){
					if(pieces[i]){
						if(pieces[i]=='D') pieces[i] = '/';
						if(pieces[i]=='M') pieces[i] = '*';
						pieces[i] += ' '+pieces[i] +' ';
					}
				}
				else if(i%3==0){
					if(pieces[i-1] && !(pieces[i]&&pieces[i].match(/(px|vw|s)$/))) pieces[i] = '%';
				}
				if(pieces[i]) value += pieces[i];
				if(i==pieces.length-1) value += ')';
			}
		}
		else if(class_piece.match(/^[a-z]+[0-9]*[A-Z]*(?:_[\-\+0-9]+(?:px|vw|s)?)*$/)){
			pieces = class_piece.split('_');
			value =	pieces[0];
			for(var i=1; i<=pieces.length-1; i++){
				if(i==1) value += '(';
				if(i>1) value += ', ';
				if(!(pieces[i]&&pieces[i].match(/(px|vw|s)$/))) pieces[i] += '%';
				value += pieces[i];
				if(i==pieces.length-1) value += ')';
			};
			console.log(value);
		}
		else{
			value = class_piece;
		}
		return value;
	};

	var getMediaQueriesOfClassPiece = function(class_piece){
		if(!(class_piece && class_piece.match(/^((?:NX|NH|X|N)[0-9]+)*$/))) return;
		return getMediaQueriesFromSuffix(class_piece);
	};

	// Make Function Section
	var makeClassOfClassName = function(className) {
		var class_pieces = className.match(/(^[a-z_]+)-((?:(?:\+|\-|D|M)?[0-9]+(?:px|vw|s)?)+|[a-z]+[0-9]{2,3}|[a-z]+[0-9]*[A-Z]*(?:_[\-\+0-9]+(?:px|vw|s)?)*)(?:-((?:(?:NX|NH|X|N)[0-9]+)*))?$/);
		if(!(className && class_pieces && class_pieces[0] && class_pieces[0].length>=1 && class_pieces[0].length==className.length)) return;
		var property_obj = getPropertyOfClassPiece(class_pieces[1]);
		var value = getValueOfClassPiece(property_obj, class_pieces[2]);
		var media_queries = getMediaQueriesOfClassPiece(class_pieces[3]);
		if( !(property_obj && property_obj.property && value) ) return null;
		return { property: property_obj.property, value: value, suffix: class_pieces[3], media_queries: media_queries };
	};

	// Variable Section
	var watcher = new MutationObserver(function(mutations, watcher) {
		mutations.forEach(function(mutation) {
			var target = mutation.target;
			target.lastClassName !== target.className && gssElement(target);
			target.lastClassName = target.className;
		});
	});

	// Initialize Section
	var initializeGssValues = function(){
		window.gss.values = {
			position_values:{ a:'absolute', f:'fixed', r:'relative' },
			display_values:{ b:'block', i:'inline', ib:'inline-block' },
			direction_values:{ t:'top', b:'bottom', r:'right', l:'left', c:'center' },
			color_values:{
				rd50: '#FFEBEE', rd100: '#FFCDD2', rd200: '#EF9A9A', rd300: '#E57373', rd400: '#EF5350', rd500: '#F44336', rd600: '#E53935', rd700: '#D32F2F', rd800: '#C62828', rd900: '#B71C1C', //Red
				pk50: '#FCE4EC', pk100: '#F8BBD0', pk200: '#F48FB1', pk300: '#F06292', pk400: '#EC407A', pk500: '#E91E63', pk600: '#D81B60', pk700: '#C2185B', pk800: '#AD1457', pk900: '#880E4F', //Pink 
				pe50: '#F3E5F5', pe100: '#E1BEE7', pe200: '#CE93D8', pe300: '#BA68C8', pe400: '#AB47BC', pe500: '#9C27B0', pe600: '#8E24AA', pe700: '#7B1FA2', pe800: '#6A1B9A', pe900: '#4A148C', //Purple 
				dp50: '#EDE7F6', dp100: '#D1C4E9', dp200: '#B39DDB', dp300: '#9575CD', dp400: '#7E57C2', dp500: '#673AB7', dp600: '#5E35B1', dp700: '#512DA8', dp800: '#4527A0', dp900: '#311B92', //Deep Purple
				io50: '#E8EAF6', io100: '#C5CAE9', io200: '#9FA8DA', io300: '#7986CB', io400: '#5C6BC0', io500: '#3F51B5', io600: '#3949AB', io700: '#303F9F', io800: '#283593', io900: '#1A237E', //Indigo 
				be50: '#E3F2FD', be100: '#BBDEFB', be200: '#90CAF9', be300: '#64B5F6', be400: '#42A5F5', be500: '#2196F3', be600: '#1E88E5', be700: '#1976D2', be800: '#1565C0', be900: '#0D47A1', //Blue  
				lb50: '#E1F5FE', lb100: '#B3E5FC', lb200: '#81D4FA', lb300: '#4FC3F7', lb400: '#29B6F6', lb500: '#03A9F4', lb600: '#039BE5', lb700: '#0288D1', lb800: '#0277BD', lb900: '#01579B', //Light Blue
				cn50: '#E0F7FA', cn100: '#B2EBF2', cn200: '#80DEEA', cn300: '#4DD0E1', cn400: '#26C6DA', cn500: '#00BCD4', cn600: '#00ACC1', cn700: '#0097A7', cn800: '#00838F', cn900: '#006064', //Cyan 
				tl50: '#E0F2F1', tl100: '#B2DFDB', tl200: '#80CBC4', tl300: '#4DB6AC', tl400: '#26A69A', tl500: '#009688', tl600: '#00897B', tl700: '#00796B', tl800: '#00695C', tl900: '#004D40', //Teal 
				gn50: '#E8F5E9', gn100: '#C8E6C9', gn200: '#A5D6A7', gn300: '#81C784', gn400: '#66BB6A', gn500: '#4CAF50', gn600: '#43A047', gn700: '#388E3C', gn800: '#2E7D32', gn900: '#1B5E20', //Green  
				lg50: '#F1F8E9', lg100: '#DCEDC8', lg200: '#C5E1A5', lg300: '#AED581', lg400: '#9CCC65', lg500: '#8BC34A', lg600: '#7CB342', lg700: '#689F38', lg800: '#558B2F', lg900: '#33691E', //Light Green
				le50: '#F9FBE7', le100: '#F0F4C3', le200: '#E6EE9C', le300: '#DCE775', le400: '#D4E157', le500: '#CDDC39', le600: '#C0CA33', le700: '#AFB42B', le800: '#9E9D24', le900: '#827717', //Lime  
				yw50: '#FFFDE7', yw100: '#FFF9C4', yw200: '#FFF59D', yw300: '#FFF176', yw400: '#FFEE58', yw500: '#FFEB3B', yw600: '#FDD835', yw700: '#FBC02D', yw800: '#F9A825', yw900: '#F57F17', //Yellow
				ar50: '#FFF8E1', ar100: '#FFECB3', ar200: '#FFE082', ar300: '#FFD54F', ar400: '#FFCA28', ar500: '#FFC107', ar600: '#FFB300', ar700: '#FFA000', ar800: '#FF8F00', ar900: '#FF6F00', //Amber  
				oe50: '#FFF3E0', oe100: '#FFE0B2', oe200: '#FFCC80', oe300: '#FFB74D', oe400: '#FFA726', oe500: '#FF9800', oe600: '#FB8C00', oe700: '#F57C00', oe800: '#EF6C00', oe900: '#E65100', //Orange
				de50: '#FBE9E7', de100: '#FFCCBC', de200: '#FFAB91', de300: '#FF8A65', de400: '#FF7043', de500: '#FF5722', de600: '#F4511E', de700: '#E64A19', de800: '#D84315', de900: '#BF360C', //Deep Orange 
				bn50: '#EFEBE9', bn100: '#D7CCC8', bn200: '#BCAAA4', bn300: '#A1887F', bn400: '#8D6E63', bn500: '#795548', bn600: '#6D4C41', bn700: '#5D4037', bn800: '#4E342E', bn900: '#3E2723', //Brown 
				gy50: '#FAFAFA', gy100: '#F5F5F5', gy200: '#EEEEEE', gy300: '#E0E0E0', gy400: '#BDBDBD', gy500: '#9E9E9E', gy600: '#757575', gy700: '#616161', gy800: '#424242', gy900: '#212121', //Grey  
				by50: '#ECEFF1', by100: '#CFD8DC', by200: '#B0BEC5', by300: '#90A4AE', by400: '#78909C', by500: '#607D8B', by600: '#546E7A', by700: '#455A64', by800: '#37474F', by900: '#263238', //Blue Grey
				bk: '#000000', //Black 
				we: '#FFFFFF'//White 
			}
		};
	};

	var initializeGssProperties = function(){
		window.gss.properties = {
			// Color Properties
			c:{property:'color', value_set:window.gss.values.color_values}, o:{property:'opacity'},
			// Background and Border Properties
			b:{property:'background', value_set:window.gss.values.color_values}, b_a:{property:'background-attachment'}, b_bm:{property:'background-blend-mode'}, b_c:{property:'background-color', value_set:window.gss.values.color_values}, b_i:{property:'background-image'}, b_p:{property:'background-position'}, b_r:{property:'background-repeat'},
			bo:{property:'border'}, bo_t:{property:'border-top'}, bo_b:{property:'border-bottom'}, bo_l:{property:'border-left'}, bo_r:{property:'border-right'},
			bo_c:{property:'border-color', value_set:window.gss.values.color_values}, bo_t_c:{property:'border-top-color', value_set:window.gss.values.color_values}, bo_b_c:{property:'border-bottom-color', value_set:window.gss.values.color_values}, bo_l_c:{property:'border-left-color', value_set:window.gss.values.color_values}, bo_r_c:{property:'border-right-color', value_set:window.gss.values.color_values},
			bo_r:{property:'border-radius'}, bo_tl_l:{property:'border-top-left-radius'}, bo_tl_r:{property:'border-top-right-radius'}, bo_bl_r:{property:'border-bottom-left-radius'}, bo_br_r:{property:'border-bottom-right-radius'},
			bo_s:{property:'border-style'}, bo_t_s:{property:'border-top-style'}, bo_b_s:{property:'border-bottom-style'}, bo_l_s:{property:'border-left-style'}, bo_r_s:{property:'border-right-style'},
			bo_w:{property:'border-width'}, bo_t_w:{property:'border-top-width'}, bo_b_w:{property:'border-bottom-width'}, bo_l_w:{property:'border-left-width'}, bo_r_w:{property:'border-right-width'},
			bo_b:{property:'boxShadow'},
			// Basic Box Properties
			bottom:{property:'bottom'}, right:{property:'right'}, top:{property:'top'}, left:{property:'left'},
			d:{property:'display', value_set:window.gss.values.display_values}, f:{property:'float', value_set:window.gss.values.direction_values},
			w:{property:'width'}, wmax:{property:'max-width'}, wmin:{property:'min-width'},
			h:{property:'height'}, hmax:{property:'max-height'}, hmin:{property:'min-height'},
			m:{property:'margin'}, m_b:{property:'margin-bottom'}, m_l:{property:'margin-left'}, m_r:{property:'margin-right'}, m_t:{property:'margin-top'},
			pg:{property:'padding'}, pg_b:{property:'padding-bottom'}, pg_l:{property:'padding-left'}, pg_r:{property:'padding-right'}, pg_t:{property:'padding-top'},
			of:{property:'overflow'}, of_x:{property:'overflow-x'}, of_y:{property:'overflow-y'},
			p:{property:'position', value_set:window.gss.values.position_values}, v:{property:'visibility'}, v_a:{property:'vertical-align'}, z:{property:'z-index'},
			// Text Properties
			l_s:{property:'letter-spacing'}, l_b:{property:'line-break'}, l_h:{property:'line-height'},
			t:{property:'text-align', value_set:window.gss.values.direction_values}, t_t:{property:'text-transform'},
			wh_s:{property:'white-space'}, 
			w_b:{property:'word-break'}, w_s:{property:'word-spacing'}, w_w:{property:'word-wrap'},
			// Text Decoration Properties
			t_s:{property:'text-shadow'},
			// Font Properties
			f_s:{property:'font-size'}, f_style:{property:'font-style'}, f_w:{property:'font-weight'},
			a:{property:'animation'},
			a_delay:{property:'animation-delay'}, a_direction:{property:'animation-direction'}, a_duration:{property:'animation-duration'},
			tm:{property:'transform'}, tm_o:{property:'transform-origin'}, tm_s:{property:'transform-style'},
			tn:{property:'transition'}, tn_p:{property:'transition-property'}, tn_dn:{property:'transition-duration'}, tn_dy:{property:'transition-delay'},
			b_s:{property:'box-sizing'},
			t_o:{property:'text-overflow'}
		};
	};

	var initialize = function(){
		initializeGssValues();
		initializeGssProperties();
		gss(document.body);
		document.addEventListener('DOMNodeInserted', function(event){
			gss(event.target);
		}, false);
	};
	initialize();

})(window, document);