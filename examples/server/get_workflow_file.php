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

if ($path) {
	$extension = isset($_GET["extension"]) ? $_GET["extension"] : "xml";
	
	$tasks_file_path = $tmp_folder . $path . "." . $extension;
	
	if ($extension == "json") {
		$content = file_exists($tasks_file_path) ? file_get_contents($tasks_file_path) : "";
		$tasks = json_decode($content, true);
		$tasks = getWorkflowDataByTasks($tasks);
	}
	else
		$tasks = getFileWorkflowData($tasks_file_path);
	//print_r($tasks);

	header("Content-type: application/json");
	echo json_encode($tasks);
}
?>
