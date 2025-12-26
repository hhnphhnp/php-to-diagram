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

if ($path && isset($_POST["save"])) {
	$extension = isset($_GET["extension"]) ? $_GET["extension"] : "xml";
	
	$data = isset($_POST["data"]) ? $_POST["data"] : null;
	$file_read_date = isset($_POST["file_read_date"]) ? $_POST["file_read_date"] : null;
	$tasks_file_path  = $tmp_folder . $path . "." . $extension;
	
	$status = createTasksFile($tasks_file_path , $data, $file_read_date);
}
else 
	$status = false;

echo $status;
?>
