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

include_once __DIR__ . "/util.php";

$path = isset($_GET["path"]) ? $_GET["path"] : null;
$obj = array();

if ($path) {
	$code_file_path = $tmp_folder . $path . ".php";
	
	if (file_exists($code_file_path)) {
		$code = file_get_contents($code_file_path); 
		
		$obj["code"] = $code;
	}
	//else
	//	$obj["error"] = "File does not exist!";
}
else 
	$obj["error"] = "Undefined file!";

if (!empty($obj)) {
	header("Content-type: application/json");
	echo json_encode($obj);
}
?>
