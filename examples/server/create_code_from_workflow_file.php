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
include_once get_lib("workflow.WorkFlowTaskHandler");

$path = isset($_GET["path"]) ? $_GET["path"] : null;
$extension = isset($_GET["extension"]) ? $_GET["extension"] : "xml";

$WorkFlowTaskHandler = new WorkFlowTaskHandler($webroot_cache_folder_path, $webroot_cache_folder_url);
$WorkFlowTaskHandler->setCacheRootPath($cache_folder_path);

$WorkFlowTaskHandler->initWorkFlowTasks();

$tasks_file_path  = $tmp_folder . $path . "." . $extension;

if ($tasks_file_path  && file_exists($tasks_file_path )) {
	//$memory_usage_before = memory_get_usage();
	
	//convert json to xml file
	if ($extension == "json") {
		$data = file_get_contents($tasks_file_path);
		$data = json_decode($data, true);
		
		$tasks = getWorkflowDataByTasks($data);
		$content = convertTasksArrayIntoXml($tasks);
		
		$temp = tmpfile();
		fwrite($temp, $content);
		
		$tasks_file_path = stream_get_meta_data($temp)['uri'];;
	}
	
	$loops = $WorkFlowTaskHandler->getLoopsTasksFromFile($tasks_file_path );
	$code = $WorkFlowTaskHandler->parseFile($tasks_file_path , $loops);
	
	if (isset($code)) {
		$obj = array("code" => $code);
		
		if (!empty($loops)) {
			$t = count($loops);
			for ($i = 0; $i < $t; $i++) {
				$loop = $loops[$i];
				$is_loop_allowed = isset($loop[2]) ? $loop[2] : null;
			
				if (!$is_loop_allowed)
					$obj["error"]["infinit_loop"][] = array(
						"source_task_id" => isset($loop[0]) ? $loop[0] : null,
						"target_task_id" => isset($loop[1]) ? $loop[1] : null
					);
			}
		}
	}
	
	if ($extension == "json")
		fclose($temp);
	
	/*$memory_usage_after = memory_get_usage();
	$memory_usage_after = memory_get_peak_usage();
	$size = $memory_usage_after - $memory_usage_before;
	$unit = array('b','kb','mb','gb','tb','pb');
	$exponent = floor( log($size, 1024) );
	$mem = @round($size / pow(1024, $exponent), 2) . ' ' . $unit[$exponent];
	error_log("Used memory in create_code_from_workflow_file script:".$mem."\n\n", 3, $GLOBALS["log_file_path"]);*/
}

if (!empty($obj)) {
	header("Content-type: application/json");
	echo json_encode($obj);
}
?>
