<?php
/*
 * Copyright (c) 2025 Bloxtor (http://bloxtor.com) and Joao Pinto (http://jplpinto.com)
 * 
 * Multi-licensed: BSD 3-Clause | Apache 2.0 | GNU LGPL v3 | HLNC License (http://bloxtor.com/LICENSE_HLNC.md)
 * Choose one license that best fits your needs.
 *
 * Original PHP to Diagram Repo: https://github.com/a19836/php-to-diagram/
 * Original Bloxtor Repo: https://github.com/a19836/bloxtor
 *
 * YOU ARE NOT AUTHORIZED TO MODIFY OR REMOVE ANY PART OF THIS NOTICE!
 */

include_once get_lib("phpscript.phpparser.phpparser_autoload");
include_once get_lib("util.text.TextSanitizer");

class CMSFileHandler {
	
	//used in the WorkFlowTaskCodeParser->getStmtValueAccordingWithType too
	/* Note that if you wish to test this be sure that the $value variable has one of the following codes:
		$value = "\\\\\\ \\p JP new Regex(\"\\p\\[\") \" \\n
			{$foo}
			<script>
			var m = /^[\\w]+$/g.exec(\"test\");
			console.log(m);
			console.log($x); //note that this will be replaced by {$x}
			console.log(\$x);
			console.log({$x});
			console.log({\$x});
			</script>";
		
		$value = '\\\\\\ \\p JP new Regex("\\p\\[") " \\n
			{$foo}
			<script>
			var m = /^[\\w]+$/g.exec("test");
			console.log(m);
			console.log($x);
			console.log(\$x);
			console.log({$x});
			console.log({\$x});
			</script>';
		
		$value = "\\\\\\ \\p JP new Regex(\"\\p\\[\") \" \\n
			{$foo}
			<script>" . '\\n á $bar joão $& {$x} {\\$x}' . "
			var m = /^[\\w]+$/g.exec(\"test\");
			console.log(m);
			console.log($x); //note that this will be replaced by {$x}
			console.log(\$x);
			console.log({$x});
			console.log({\$x});
			</script>";
	*/
	public static function getStmtValueAccordingWithType($value, $value_type) {
		//error_log("$value, $value_type\n\n", 3, "/var/www/html/livingroop/default/tmp/test.log");
		
		if ($value_type == "scalar_string" || $value_type == "scalar_encapsed" || $value_type == "scalar_interpolatedstring") {
			$first_char = substr($value, 0, 1);
			
			$value = substr($value, 1, -1); //remove double quotes
			
			//2019-10-17: DO NOT USE THE stripslashes. Use instead the stripcslashes, otherwise if we have a end-line escaped ("\\\n" or '\n'), it will convert tis to a real end-line
			//2020-09-13: Do not add the stripcslashes either bc it removes the back-slashes from the escaped backslashes and we want to show th raw code. By default the $value already contains the right slashes, with the exception of quotes, end-lines and tabs which should be unescaped if not escaped! The $ symbol it is escaped too by default, so we unescaped by default!
			//$value = stripcslashes($value); //remove slashes from quotes that are not escaped and other slashes
		
			//un-escaped quotes
			$value = TextSanitizer::stripCSlashes($value, $first_char);
			
			//un-escaped end-lines and tabs
			$value = TextSanitizer::replaceIfNotEscaped('\n', "\n", $value);
			$value = TextSanitizer::replaceIfNotEscaped('\t', "\t", $value);
			
			/* Note that this function always returns the $value but for double quotes, so if we have  a single quote, we must convert it to double quotes.
			 If quote is a single quote, it means that the $value_type is a single quote type, where the variales should be escaped by default, this is, if we have the code:
				$x = 'foo $y bar';
				where $value == 'foo $y bar'
				
				than the $value should become 'foo \$y bar' with the following code:
					$x = "foo \$y bar";
				
				If we have the code:
					$x = 'foo \\$y bar';
				it will be replaced by:
					$x = "foo \\\$y bar";
				
				If we have the code:
					$x = 'foo \$y bar';
				the phpparser class will convert it automatically to:
					$x = 'foo \\$y bar';
				and then it will be replaced by:
					$x = "foo \\\$y bar";
			*/
			if ($first_char == "'") //transforms the single code behaviour in the the double quote behaviour, adding backslash to all $ symbols even if they are already escaped
				$value = str_replace('$', '\\$', $value);//2020-09-14: Do not use TextSanitizer::replaceIfNotEscaped('$', '\\$', $value) or addcslashes or addslashes, bc we only want to add backspaces to all $ symbols (even the escaped ones) and leave the \n and \t alone! This is the default behaviour of single quotes!
			
			/* 2020-09-13: Do not uncomment this code is deprecated
			//$value = preg_replace('/(\${?[\w]+)/u', '\\\\$1', $value);
			//or $value = str_replace('$', '\$', $value);
			
			//if ($first_char == '"')
				//$value = preg_replace('/{\\(\$[\w]+)/u', '{$1', $value);
				//or $value = str_replace('{\$', '{$', $value);
			
			To replace the cases where it was added a backslash to the $ without being a php variable, use the preg_replace bellow.
			This will be used for the cases like the javascript code: 
				\$.find
				that wil be converted to: $.find
				
				\$function() {}
				that wil be converted to: $function() {}
				
				/^[\\p\\w]+\$/g.exec("test");
				that wil be converted to: /^[\\p\\w]+$/g.exec("test");
			
			Note that the phpparser adds automatically a backslash to all '$' symbols even if is not a variable. So we need to remove the cases where it is not a variable. This only happens when code is inside of double quotes, but bc the code above "TextSanitizer::replaceIfNotEscaped('$', '\\$', $value);", should happens when the cod is inside of single quotes too.
			*/
			$value = preg_replace('/(|[^\\\\])\\\\(\${?[^\w])/u', '$1$2', $value); //'/(|[^\\])\\(\$[^\w])/' won't work bc the preg_replace removes 1 backslash, so we need to have: '/(|[^\\\\])\\\\(\$[^\w])/'. '\w' means all words with '_' and '/u' means with accents and ç too. '/u' converts unicode to accents chars.
			
			//if(strpos($value, "JP") !== false)error_log("$value\n\n", 3, "/var/www/html/livingroop/default/tmp/test.log");
			//error_log("$value\n\n", 3, "/tmp/test.log");
			//echo "value:$value\n";
			//if (strpos($value, "html(msg.replace(") !== false) die();
		}
		else if ($value_type == "expr_binaryop_concat") { //2019-11-20: if we have a code a string concat where there is inside some text surronded by double quotes, we must convert the '\n' inside of the double quotes to end-lines with the stripclashes function
			//This is, if we have something like: "xx\n\t\t\t\tx" . $as . 'as\n asdas', we want to convert the \n and \t of "xx\n\t\t\t\tx"
			//echo "<pre>value($value_type):$value<pre><br>";
			
			$value_chars = TextSanitizer::mbStrSplit($value);
			$t = count($value_chars);
			$new_value = "";
			
			for ($i = 0; $i < $t; $i++) {
				$char = $value_chars[$i];
				
				if (($char == '"' || $char == "'") && !TextSanitizer::isMBCharEscaped($value, $i, $value_chars)) {
					for ($j = $i + 1; $j < $t; $j++) 
						if ($value_chars[$j] == $char && !TextSanitizer::isMBCharEscaped($value, $j, $value_chars)) 
							break;
					
					$sub_value = implode("", array_slice($value_chars, $i, ($j + 1) - $i));
					
					//2019-11-20: DO NOT USE THE stripslashes or stripcslashes, otherwise if we have any escaped \" both functions will remove this slashes, and we want to keep them bc the $value is php code. We only want to convert to end-lines and tabs inside of double quotes! So use the TextSanitizer::replaceIfNotEscaped instead.
					$sub_value = TextSanitizer::replaceIfNotEscaped('\n', "\n", $sub_value);
					$sub_value = TextSanitizer::replaceIfNotEscaped('\t', "\t", $sub_value);
					
					//Note that the phpparser adds automatically a backslash to all '$' symbols even if is not a variable. So we need to remove the cases where it is not a variable. This only happens when code is inside of double quotes.
					if ($char == '"')
						$sub_value = preg_replace('/(|[^\\\\])\\\\(\${?[^\w])/u', '$1$2', $sub_value); //'\w' means all words with '_' and '/u' means with accents and ç too. '/u' converts unicode to accents chars.
					
					$new_value .= $sub_value;
					$i = $j;
				}
				else
					$new_value .= $char;
			}
			
			$value = $new_value;
		}
		
		return $value;
	}
	
	public static function getArgumentType($arg) {
		if (empty($arg) && $arg !== 0)
			return "";
		
		$arg = trim($arg);
		
		if (strtolower($arg) == "null" || is_numeric($arg))
			return "";
		
		preg_match_all('/^(\$[\w\[\]\$]+)$/u', $arg, $matches, PREG_PATTERN_ORDER); //'\w' means all words with '_' and '/u' means with accents and ç too. '/u' converts unicode to accents chars.
		
		if (isset($matches[0][0]) && $matches[0][0] == $arg)
			return "variable";
		
		$first_char = substr($arg, 0, 1);
		if (($first_char == '"' || $first_char == "'") && substr($arg, -1) == $first_char) {
			$arg = substr($arg, 1, -1);
			$start = 0;
			
			do {
				$pos = strpos($arg, $first_char, $start);
				$start = $pos + 1;
				
				if ($pos !== false && !TextSanitizer::isCharEscaped($arg, $pos))
					return "";
			}
			while ($pos !== false);
			
			return "string";
		}
		
		return "";
	}
	
	public static function prepareArgument($arg, $arg_type) {
		if ($arg_type == "string")
			return self::getStmtValueAccordingWithType($arg, "scalar_string");
		
		return $arg_type == "variable" ? substr($arg, 1) : (!$arg_type && strtolower($arg) == "null" ? null : $arg);
	}
}
?>
