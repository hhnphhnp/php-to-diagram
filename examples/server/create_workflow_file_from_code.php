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
include get_lib("workflow.WorkFlowTaskHandler");
include get_lib("workflow.WorkFlowTaskCodeParser");

$path = isset($_GET["path"]) ? $_GET["path"] : null;
$extension = isset($_GET["extension"]) ? $_GET["extension"] : "xml";
$status = false;

if ($path && isset($_POST)) {
	$code = htmlspecialchars_decode( file_get_contents("php://input"), ENT_NOQUOTES); 
	/*The ENT_NOQUOTES will avoid converting the &quot; to ". If this is not here and if we have some form settings with PTL code like: 
		$form_settings = array("ptl" => array("code" => "<ptl:echo str_replace('\"', '&quot;', \$var_aux_910) />"));
	...it will give a php error, because it will convert &quot; into ", which will be:
		$form_settings = array("ptl" => array("code" => "<ptl:echo str_replace('\"', '"', \$var_aux_910) />"));
	Note that " is not escaped. It should be:
		$form_settings = array("ptl" => array("code" => "<ptl:echo str_replace('\"', '\"', \$var_aux_910) />"));
	
	This ENT_NOQUOTES option was added in 2018-01-09, and I did not tested it for other cases
	*/
	
	//load allowed tasks
	$WorkFlowTaskHandler = new WorkFlowTaskHandler($webroot_cache_folder_path, $webroot_cache_folder_url);
	$WorkFlowTaskHandler->setCacheRootPath($cache_folder_path);
	//$WorkFlowTaskHandler->flushCache();
	
	//(optional) set allowed tasks from the workflow loaded tasks - get it from cache
	/*$loaded_tasks_settings_cache_id = isset($_GET["loaded_tasks_settings_cache_id"]) ? $_GET["loaded_tasks_settings_cache_id"] : null;
	$loaded_tasks_settings_cache_id = $loaded_tasks_settings_cache_id ? $loaded_tasks_settings_cache_id : $WorkFlowTaskHandler->getLoadedTasksSettingsCacheId();
	$loaded_tasks_settings = $WorkFlowTaskHandler->getCachedLoadedTasksSettings($loaded_tasks_settings_cache_id); //Do not use getLoadedTasksSettings bc we want to get the loaded tasks settings with the corespondent $loaded_tasks_settings_cache_id
	
	if ($loaded_tasks_settings) {
		$allowed_tasks_tag = array();
		foreach ($loaded_tasks_settings as $group_id => $group_tasks) 
			foreach ($group_tasks as $task_type => $task_settings) 
				$allowed_tasks_tag[] = isset($task_settings["tag"]) ? $task_settings["tag"] : null;
		
		if ($allowed_tasks_tag) 
			$WorkFlowTaskHandler->setAllowedTaskTags($allowed_tasks_tag);
	}*/
	
	$WorkFlowTaskHandler->initWorkFlowTasks();
	
	//convert code to xml
	$WorkFlowTaskCodeParser = new WorkFlowTaskCodeParser($WorkFlowTaskHandler);

	//$available_statements = $WorkFlowTaskCodeParser->getAvailableStatements();
	//print_r($available_statements);
	//$tasks = $WorkFlowTaskCodeParser->getParsedCodeAsArray($code);
	//print_r($tasks);
	
	$xml = $WorkFlowTaskCodeParser->getParsedCodeAsXml($code);
	
	if ($extension == "json") {
		$tasks = convertXMLToArray($xml);
		$tasks = getWorkflowDataByTasks($tasks);
		$content = json_encode($tasks);
	}
	else
		$content = $xml;
	
	//save xml to file
	$tasks_file_path  = $tmp_folder . $path . "." . $extension;
	$folder = dirname($tasks_file_path );
			
	if (is_dir($folder) || mkdir($folder, 0775, true))
		if (file_put_contents($tasks_file_path , $content) > 0) 
			$status = true;
}

echo $status;
?>
