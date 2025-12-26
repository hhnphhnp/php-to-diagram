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

include_once dirname(__DIR__) . "/config.php";
include_once get_lib("util.xml.MyXML");
include_once get_lib("util.xml.MyXMLArray");

function createTasksFile($tasks_file_path , $data, $file_read_date = null) {
	if (!empty($tasks_file_path )) {
		$folder = dirname($tasks_file_path );
		
		if (is_dir($folder) || mkdir($folder, 0775, true)) {
			$file_write_date = file_exists($tasks_file_path ) ? filemtime($tasks_file_path ) : null;
			
			if ($file_read_date && $file_write_date && $file_write_date > $file_read_date) 
				return 2;
			
			$extension = pathinfo($tasks_file_path , PATHINFO_EXTENSION);
			$content = convertTasksArrayIntoXml($data);
			//echo $content;
			
			if ($extension == "json") {
				$tasks = convertXMLToArray($content);
				$content = json_encode($tasks);
			}
			
			return file_put_contents($tasks_file_path , $content) > 0;
		}
	}
	
	return false;
}

function convertTasksArrayIntoXml($data) {
	$xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
	$xml .= "<tasks>\n";
	
	if (is_array($data)) {
		if (isset($data["settings"]) && is_array($data["settings"])) {
			$settings_xml = "";
			
			foreach ($data["settings"] as $settings_name => $settings_value)
				if ($settings_name && !is_numeric($settings_name)) {
					if (is_array($settings_value) || is_object($settings_value))
						$settings_value = json_encode($settings_value);
					
					if (!is_numeric($settings_value) && !is_bool($settings_value))
						$settings_value = "<![CDATA[$settings_value]]>";
					
					$settings_xml .= "\t\t<$settings_name>$settings_value</$settings_name>\n";
				}
			
			if ($settings_xml) {
				$xml .= "\t<settings>\n";
				$xml .= $settings_xml;
				$xml .= "\t</settings>\n";
			}
		}
		
		foreach ($data as $key => $value) 
			if ($key != "containers" && $key != "tasks" && $key != "settings") {
				if (is_array($value)) {
					$xml .= "\t<$key>\n";
					$xml .= getNodeToXML($value, "\t\t");
					$xml .= "\t</$key>\n";
				}
				else
					$xml .= "\t<$key>" . getNodeToXML($value) . "</$key>\n";
			}
		
		foreach ($data as $key => $value) 
			if (is_array($value) && ($key == "containers" || $key == "tasks")) {
				$node_name = substr($key, 0, -1); //remove plural
				
				foreach ($value as $obj_id => $obj) { //note that the $obj_id may be a numeric key, so we should not use it
					$xml .= "\t<$node_name";
					
					if ($key == "tasks") {
						if (isset($obj["start"]) && $obj["start"] > 0) 
							$xml .= " start=\"" . $obj["start"] . "\"";
						
						unset($obj["start"]);
					}
					
					$xml .= ">\n";
					$xml .= getNodeToXML($obj, "\t\t");
					$xml .= "\t</$node_name>\n";
				}
			}
	}	
	
	$xml .= "</tasks>";
	
	return $xml;
}

function getNodeToXML($arr, $prefix = "") {
//print_r($arr);
	$xml = "";

	if (is_array($arr)) {
		foreach ($arr as $key => $value) {
			if (is_array($value)) {
				$non_numeric_keys_arr = array();
				$numeric_keys_arr = array();
				
				foreach ($value as $i => $item) {
					if (is_numeric($i))
						$numeric_keys_arr[$i] = $item;
					else
						$non_numeric_keys_arr[$i] = $item;
				}
				
				if (!empty($non_numeric_keys_arr) && empty($numeric_keys_arr)) {
					$numeric_keys_arr = array($value);
					$non_numeric_keys_arr = array();
				}
				
				foreach ($numeric_keys_arr as $item) {
					if (is_array($item)) {
						//echo getNodeToXML($item, $prefix . "\t");echo "!!!$item($is_array_keys_only_numeric)!!!";print_r($item);
						$xml .= "$prefix<$key>\n";
						$xml .= getNodeToXML($item, $prefix . "\t");
						$xml .= "$prefix</$key>\n";
					}
					else
						$xml .= "$prefix<$key>" . getNodeToXML($item) . "</$key>\n";
				}
				
				//This is for the exceptional cases, where the input array has numeric and string keys at the same time.
				if (!empty($non_numeric_keys_arr) && !empty($numeric_keys_arr))
					$xml .= getNodeToXML($non_numeric_keys_arr, $prefix);
			}
			else
				$xml .= "$prefix<$key>" . getNodeToXML($value) . "</$key>\n";
		}
	}
	else
		$xml .= is_numeric($arr) || is_bool($arr) ? $arr : (!empty($arr) ? "<![CDATA[$arr]]>" : "");

	return $xml;
}

function getFileWorkflowData($path) {
	$tasks = convertXMLFileToArray($path);
	return getWorkflowDataByTasks($tasks);
}

function convertXMLFileToArray($tasks_file_path) {
	$xml_content = file_exists($tasks_file_path) ? file_get_contents($tasks_file_path) : "";
	return convertXMLToArray($xml_content);
}

function convertXMLToArray($xml_content) {
	$tasks = array();
	
	if (!empty($xml_content)) {
		$MyXML = new MyXML($xml_content);
		$arr = $MyXML->toArray();
		$new_arr = $MyXML->complexArrayToBasicArray($arr, array("lower_case_keys" => true, "trim" => true));
		$tasks = isset($new_arr["tasks"]) ? $new_arr["tasks"] : null;
		
		if (!empty($tasks["container"]) && isset($tasks["container"]["id"]))
			$tasks["container"] = array($tasks["container"]);
		
		if (!empty($tasks["task"]) && isset($tasks["task"]["id"]))
			$tasks["task"] = array($tasks["task"]);
	}
	
	return $tasks;
}

function getWorkflowDataByTasks($tasks) {
	$tasks["container"] = isset($tasks["container"]) ? $tasks["container"] : null;
	$tasks["container"] = isset($tasks["container"]["id"]) ? array($tasks["container"]) : $tasks["container"];
	
	$tasks["task"] = isset($tasks["task"]) ? $tasks["task"] : null;
	$tasks["task"] = isset($tasks["task"]["id"]) ? array($tasks["task"]) : $tasks["task"];
	
	$parsed_tasks = array();
	$parsed_tasks["settings"] = array();
	$parsed_tasks["containers"] = array();
	$parsed_tasks["tasks"] = array();
	
	if (!empty($tasks["settings"]))
		foreach ($tasks["settings"] as $key => $value) {
			if (
				(substr($value, 0, 1) == "{" && substr($value, -1) == "}") || 
				(substr($value, 0, 1) == "[" && substr($value, -1) == "]")
			)
				$value = json_decode($value, true);
			
			$parsed_tasks["settings"][$key] = $value;
		}
	
	foreach ($tasks as $key => $value) 
		if ($key != "container" && $key != "task" && $key != "settings")
			$parsed_tasks[$key] = $value;
	
	foreach ($tasks as $key => $value)
		if (($key == "container" || $key == "task") && is_array($value)) {
			foreach ($value as $obj)
				if (isset($obj["id"])) 
					$parsed_tasks[$key . "s"][ $obj["id"] ] = $obj;
		}
	
	return $parsed_tasks;
}
?>
