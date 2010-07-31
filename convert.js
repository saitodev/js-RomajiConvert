// -*- coding: utf-8 -*-
if( typeof RomajiConvert === 'undefined' ){
  RomajiConvert = {};
}

RomajiConvert.convert = (function(){
  var next_exists = function(table, string) {
    if(string.length === 0){
      return false;
    }
    var head = string[0];
    return table[head] != undefined;
  };

  var concat_string = function(list1, list2){
    var result = [];
    for(var i=0, len1=list1.length; i<len1; ++i){
      for(var j=0, len2=list2.length; j<len2; ++j){
	result.push(list1[i] + list2[j]);
      }
    }
    return result;
  };

  var convert_internal = function(orig_table, orig_string){
    var table = orig_table;
    var string = orig_string;
    var conversion = [""];
    while(true){
      if(string.length === 0){
	return conversion;
      }
      var head = string[0];
      var rest = string.slice(1);
      if( (head === 'っ' || head === 'ッ') && rest.length > 0){
	var convert_rest = $.map(convert_internal(orig_table, rest),
				 function(str){
				   return str[0] + str;
				 });
	return concat_string(conversion, convert_rest);
      }
      var node = table[head];
      if(node.subtable === null){
	table = orig_table;
	string = rest;
	conversion = concat_string(conversion, node.result);
	continue;
      }
      else{
	if(next_exists(node.subtable, rest)){
	  table = node.subtable;
	  string = rest;
	  continue;
	}
	else{
	  table = orig_table;
	  string = rest;
	  conversion = concat_string(conversion, node.result);
	  continue;
	}
      }
    }
  }

  var convert_main = function(str){
    return convert_internal(RomajiConvert.table, str);
  };

  function join_with_convinations(arr){
    if(arr.length < 2){
      return arr;
    }
    else{
      var fst = arr[0];
      var snd = arr[1];
      var rest = arr.slice(2);
      
      return join_with_convinations([concat_string(fst, snd)].concat(rest));
    }
  };
  
  var re = /([a-zA-Z0-9 -_]+)/;
  
  return function(str){
    var splited_str = $.grep(str.split(re),
			     function(s){
			       return s !== '';
			     });
    var converted = [];
    $.each(splited_str,
	   function(index, str){
	     if(str.match(re)){
	       converted.push([str]);
	     }
	     else{
	       converted.push(convert_main(str));
	     }
	   });
    return join_with_convinations(converted);
  };
})();
