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

if ($path && isset($_POST)) {
	$code_file_path = $tmp_folder . $path . ".php";
	$code_folder_path = dirname($code_file_path);
	
	if ((is_dir($code_folder_path) || mkdir($code_folder_path, 0755, true)) && is_writable($code_folder_path)) {
		$code = htmlspecialchars_decode( file_get_contents("php://input"), ENT_NOQUOTES); 
		
		$status = file_put_contents($code_file_path, $code) !== false;
	}
}
else 
	$status = false;

echo $status;
?>
