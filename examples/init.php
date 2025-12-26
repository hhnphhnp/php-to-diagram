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

include_once __DIR__ . "/config.php";
include_once get_lib("workflow.WorkFlowTaskHandler");
include_once get_lib("util.web.html.CssAndJSFilesOptimizer");

//check if 'examples/tmp' folder is writable and if not, show warning
if (!is_dir($tmp_folder)) {
	echo $style;
	echo '<div class="error">Please create the folder: "' . $tmp_folder . '".</div>';
	die();
}
else if (!is_writable($tmp_folder)) {
	echo $style;
	echo '<div class="error">Tmp folder must be writable at "' . $tmp_folder . '".</div>';
	die();
}
else {
	//check if all files are writable
	$files = array_diff(scandir($tmp_folder), array('..', '.'));
	
	if ($files)
		foreach ($files as $file) {
			$fp = "$tmp_folder/$file";
			
			if (!is_writable($fp)) {
				echo $style;
				echo '<div class="error">Tmp file must be writable: "' . $fp . '".</div>';
				die();
			}
		}
}

//prepare WorkFlowTaskHandler
$WorkFlowTaskHandler = new WorkFlowTaskHandler($webroot_cache_folder_path, $webroot_cache_folder_url);
$WorkFlowTaskHandler->setCacheRootPath($cache_folder_path);

//(optional)
//$WorkFlowTaskHandler->setTasksFolderPaths(array(WorkFlowTaskHandler::getDefaultTasksFolderPath() . "/programming", "common")); //set folder where your tasks are:
//$WorkFlowTaskHandler->addTasksFoldersPath($code_workflow_editor_user_tasks_folders_path); //additionally to the default tasks folder, add other folders with tasks inside

//(optional) then, only allow specific tasks by folders
//$WorkFlowTaskHandler->setAllowedTaskFolders(array("programming/")); //only allow specific tasks, based in a folder.
//$WorkFlowTaskHandler->addAllowedTaskTagsFromFolders($code_workflow_editor_user_tasks_folders_path); //and also allow the tasks for inside of the additionally folder.

//(optional) or
//allow individual tasks by type or tag
$WorkFlowTaskHandler->setAllowedTaskTags(array(
	"definevar", "setvar", "setarray", "setdate", "ns", "createfunction", "createclass", "setobjectproperty", "createclassobject", "callobjectmethod", "callfunction", "addheader", "if", "switch", "loop", "foreach", "includefile", "echo", "code", "break", "return", "exit", "validator", "upload", "geturlcontents", "getbeanobject", "sendemail", "debuglog",
	"restconnector", "soapconnector", 
	"trycatchexception", "throwexception", "printexception",
	"getdbdriver", "setquerydata", "getquerydata", "dbdaoaction",
	"inlinehtml", "createform"
));
//$WorkFlowTaskHandler->setAllowedTaskTypes(array("if", "switch"));

//(optional)
//allow tasks only on specific containers
//$containers = array(
//	"content_with_only_if" => array("if"), 
//	"content_with_only_switch" => array("switch")
//);
//$WorkFlowTaskHandler->setTasksContainers($containers);

//*********************
$WorkFlowTaskHandler->initWorkFlowTasks();

$tasks_settings = $WorkFlowTaskHandler->getLoadedTasksSettings();
$tasks_containers = $WorkFlowTaskHandler->getParsedTasksContainers();
//$loaded_tasks = $WorkFlowTaskHandler->getLoadedTasks();
//$loaded_tasks_settings_cache_id = $WorkFlowTaskHandler->getLoadedTasksSettingsCacheId();

//(opitonal) organize tasks by groups
$tasks_groups_by_tag = array(
	"Logic" => array("definevar", "setvar", "setarray", "setdate", "ns", "createfunction", "createclass", "setobjectproperty", "createclassobject", "callobjectmethod", "callfunction", "addheader", "if", "switch", "loop", "foreach", "includefile", "echo", "code", "break", "return", "exit", "geturlcontents", "getbeanobject", "sendemail", "debuglog"),
	"Connectors" => array("restconnector", "soapconnector"),
	"Exception" => array("trycatchexception", "throwexception", "printexception"),
	"DB" => array("getdbdriver", "setquerydata", "getquerydata", "dbdaoaction"),
	"HTML" => array("inlinehtml", "createform"),
);

//(opitonal) sort tasks to show first
$tasks_order_by_tag = array("if", "setvar", "callfunction", "callobjectmethod", "echo", "throwexception");

//FUNCTIONS

function printTasksList($tasks_settings, $tasks_groups_by_tag, $tasks_order_by_tag) {
	$html = '<ul class="tasks_groups">';
	
	//PREPARING TASKS BY TAG
	$tasks_by_tag = array();
	foreach ($tasks_settings as $group_id => $group_tasks)
		foreach ($group_tasks as $task_type => $task_settings) {
			$tag = isset($task_settings["tag"]) ? $task_settings["tag"] : null;
			
			if ($tag)
				$tasks_by_tag[$tag] = array($task_type, $task_settings);
		}
	
	$added = array();
	
	//PREPARING TASKS GROUPS - IF EXISTS
	if (is_array($tasks_groups_by_tag)) {
		foreach ($tasks_groups_by_tag as $group_name => $tags) {
			if ($tags) {
				$group_html = "";
				
				$t = count($tasks_order_by_tag);
				for ($i = 0; $i < $t; $i++) {
					$tag = $tasks_order_by_tag[$i];
					
					if (in_array($tag, $tags)) {
						$task = isset($tasks_by_tag[$tag]) ? $tasks_by_tag[$tag] : null;
						$task_type = isset($task[0]) ? $task[0] : null;
						$task_settings = isset($task[1]) ? $task[1] : null;
						
						if ($task_type && $task_settings) {
							$added[] = $task_type;
							
							$group_html .= printTaskList($task_type, $task_settings);
						}
					}
				}
				
				$t = count($tags);
				for ($i = 0; $i < $t; $i++) {
					$tag = $tags[$i];
					
					$task = isset($tasks_by_tag[$tag]) ? $tasks_by_tag[$tag] : null;
					$task_type = isset($task[0]) ? $task[0] : null;
					$task_settings = isset($task[1]) ? $task[1] : null;
					
					if ($task_type && $task_settings && !in_array($task_type, $added)) {
						$added[] = $task_type;
						
						$group_html .= printTaskList($task_type, $task_settings);
					}
				}
				
				//only show group if there is any task inside, otherwise it shows an empty group, which does not make sense.
				if ($group_html) {
					$group_class = "tasks_group_" . str_replace(array(" ", "-"), "_", strtolower($group_name));
					
					$html .= '<li class="tasks_group ' . $group_class . '">';
					$html .= '<div class="tasks_group_label">' . $group_name . '</div>';
					$html .= '<div class="tasks_group_tasks">';
					$html .= $group_html;
					$html .= '</div>
						<div style="clear:left; float:none;"></div>
					</li>';
				}
			}
		}
	}
	
	//PREPARING OTHER TASKS THAT ARE NOT IN THE TASKS GROUPS or IF TASKS GROUPS ARE EMPTY, SHOW ALL TASKS
	$contains_multiple_groups = count($added) > 0;
	$html_others = "";
	//print_r($tasks_settings);die();
	//print_r(array_keys($tasks_settings));die();
	//print_r($tasks_order_by_tag);die();
	
	foreach ($tasks_settings as $group_id => $group_tasks) {
		if ($group_tasks) {
			$t = count($tasks_order_by_tag);
			for ($i = 0; $i < $t; $i++) {
				$tag = $tasks_order_by_tag[$i];
				$task = isset($tasks_by_tag[$tag]) ? $tasks_by_tag[$tag] : null;
				$task_type = isset($task[0]) ? $task[0] : null;
				
				if (!empty($group_tasks[$task_type]) && !in_array($task_type, $added)) {
					$added[] = $task_type;
					
					$html_others .= printTaskList($task_type, $group_tasks[$task_type]);
				}
			}
			
			foreach ($group_tasks as $task_type => $task_settings) 
				if (!in_array($task_type, $added)) 
					$html_others .= printTaskList($task_type, $task_settings);
		}
	}
	
	if ($html_others) {
		$html .= '<li class="tasks_group tasks_group_others">';
		$html .= $contains_multiple_groups ? '<div class="tasks_group_label">Others</div>' : '';
		$html .= '<div class="tasks_group_tasks">' . $html_others . '</div>
			<div style="clear:left; float:none;"></div>
		</li>';
	}
	
	$html .= '</ul>';
	
	return $html;
}

function printTaskList($task_type, $task_settings) {
	$task_tag = isset($task_settings["tag"]) ? str_replace(" ", "_", $task_settings["tag"]) : "";
	$task_label = isset($task_settings["label"]) ? $task_settings["label"] : null;
	
	return '<div class="task task_menu task_' . $task_type . ' task_' . $task_tag . '" type="' . $task_type . '" tag="' . $task_tag . '" title="' . str_replace('"', "&quot;", $task_label) . '"><span>' . $task_label . '</span></div>';
}

function printTasksProperties($tasks_settings, $tasks_order_by_tag) {
	$html = "";

	if (!empty($tasks_order_by_tag)) {
		$tasks_settings = $tasks_settings;
		
		$t = count($tasks_order_by_tag);
		for ($i = 0; $i < $t; $i++) {
			$tag = $tasks_order_by_tag[$i];
			
			foreach ($tasks_settings as $group_id => $group_tasks) {
				foreach ($group_tasks as $task_type => $task_settings) {
					$task_tag = isset($task_settings["tag"]) ? $task_settings["tag"] : null;
					
					if ($task_tag == $tag) {
						if (!empty($task_settings["task_properties_html"])) {
							$html .= '<div class="task_properties task_properties_' . $task_type . '">' . (is_array($task_settings) ? $task_settings["task_properties_html"] : $task_settings) . '</div>';
						}
						
						unset($tasks_settings[$group_id][$task_type]);
						break;
					}
				}
			}
		}
		
		foreach ($tasks_settings as $group_id => $group_tasks) {
			foreach ($group_tasks as $task_type => $task_settings) {
				if (!empty($task_settings["task_properties_html"])) {
					$html .= '<div class="task_properties task_properties_' . $task_type . '">' . (is_array($task_settings) ? $task_settings["task_properties_html"] : $task_settings) . '</div>';
				}
			}
		}
	}
	else {
		foreach ($tasks_settings as $group_id => $group_tasks) {
			foreach ($group_tasks as $task_type => $task_settings) {
				if (!empty($task_settings["task_properties_html"])) {
					$html .= '<div class="task_properties task_properties_' . $task_type . '">' . (is_array($task_settings) ? $task_settings["task_properties_html"] : $task_settings) . '</div>';
				}
			}
		}
	}
	
	return $html;
}

function printConnectionsProperties($tasks_settings) {
	$html = "";

	foreach ($tasks_settings as $group_id => $group_tasks) {
		foreach ($group_tasks as $task_type => $task_settings) {
			if (!empty($task_settings["connection_properties_html"])) {
				$html .= '<div class="connection_properties connection_properties_' . $task_type . '">' . (is_array($task_settings) ? $task_settings["connection_properties_html"] : $task_settings) . '</div>';
			}
		}
	}
	
	return $html;
}

function printTasksCSSAndJS($tasks_settings, $webroot_cache_folder_path, $webroot_cache_folder_url) {
	$css_files = $js_files = array();
	
	foreach ($tasks_settings as $group_id => $group_tasks)
		foreach ($group_tasks as $task_type => $task_settings)
			if (is_array($task_settings)) {
				if (!empty($task_settings["files"]["css"]))
					$css_files = array_merge($css_files, $task_settings["files"]["css"]);
				
				if (!empty($task_settings["files"]["js"]))
					$js_files = array_merge($js_files, $task_settings["files"]["js"]);
			}
	
	$wcfp = $webroot_cache_folder_path ? $webroot_cache_folder_path . "/" . WorkFlowTaskHandler::TASKS_WEBROOT_FOLDER_PREFIX . "files/" : null;
	$wcfu = $webroot_cache_folder_url ? $webroot_cache_folder_url . "/" . WorkFlowTaskHandler::TASKS_WEBROOT_FOLDER_PREFIX . "files/" : null;
	
	$CssAndJSFilesOptimizer = new CssAndJSFilesOptimizer($wcfp, $wcfu);
	$html = $CssAndJSFilesOptimizer->getCssAndJSFilesHtml($css_files, $js_files);
	
	//prepare inline css and js
	$inline_css = $inline_js = "";
	
	foreach ($tasks_settings as $group_id => $group_tasks) {
		foreach ($group_tasks as $task_type => $task_settings) {
			if (is_array($task_settings)) {
				if (isset($task_settings["css"]) && trim($task_settings["css"]))
					$inline_css .= $task_settings["css"] . "\n";
		
				if (isset($task_settings["js_code"]) && trim($task_settings["settings"]["js_code"]))
					$inline_js .= $task_settings["settings"]["js_code"] . "\n";
			}
		}
	}
	
	if (trim($inline_css))
		$html .= '<style type="text/css">' . $inline_css . '</style>' . "\n";
	
	if (trim($inline_js))
		$html .= '<script language="javascript" type="text/javascript">' . $inline_js . '</script>' . "\n";
	
	return $html;
}

function printTasksContainers($tasks_containers) {
	$html = "";

	if (is_array($tasks_containers))
		foreach ($tasks_containers as $container_id => $container_tasks) 
			$html .= '<div class="task_container" id="' . $container_id . '"></div>';
	
	return $html;
}

function getTasksContainersByTaskType($tasks_containers) {
	$containers_per_task = array();

	foreach ($tasks_containers as $container_id => $task_types) 
		if ($task_types) {
			$t = count($task_types);
			for ($i = 0; $i < $t; $i++)
				$containers_per_task[ $task_types[$i] ][] = $container_id;
		}
	
	return json_encode($containers_per_task);
}

function getTasksSettingsObj($tasks_settings) {
	$html = "{";

	foreach ($tasks_settings as $group_id => $group_tasks) {
		foreach ($group_tasks as $task_type => $task_settings) {
			if (is_array($task_settings)) {
				if (isset($task_settings["settings"]) && is_array($task_settings["settings"])) {
					$html .= ($html != "{" ? ", " : "") . '"' . $task_type . '" : {';
					
					$idx = 0;
					foreach ($task_settings["settings"] as $key => $value) {
						if (is_array($value)) {
							$new_value = "{";
							foreach ($value as $sub_key => $sub_value) {
								if (strlen(trim($sub_value)) > 0) {
									$new_value .= ($new_value != "{" ? ", " : "") . '"' . strtolower($sub_key) . '" : ' . $sub_value;
								}
							}
							$new_value .= "}";
							
							$value = $new_value;
						}
						
						if (strlen(trim($value)) > 0) {
							$html .= ($idx > 0 ? ", " : "") . '"' . strtolower($key) . '" : ' . $value;
							$idx++; 
						}
					}
					
					$html .= '}';
					
					//MyArray::arrKeysToLowerCase($task_settings["settings"], true);
					//$html .= $html != "{" ? ", " : "";
					//$html .= '"' . $task_type . '" : ' . json_encode($task_settings["settings"]);
				}
			}
		}
	}
	
	$html .= "}";

	return $html;
}
?>
