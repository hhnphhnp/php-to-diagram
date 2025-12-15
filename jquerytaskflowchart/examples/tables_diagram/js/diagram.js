/*
 * Copyright (c) 2025 Bloxtor (http://bloxtor.com) and Joao Pinto (http://jplpinto.com)
 * 
 * Multi-licensed: BSD 3-Clause | Apache 2.0 | GNU LGPL v3 | HLNC License (http://bloxtor.com/LICENSE_HLNC.md)
 * Choose one license that best fits your needs.
 *
 * Original JQuery Task flow Chart Repo: https://github.com/a19836/jquerytaskflowchart/
 * Original Bloxtor Repo: https://github.com/a19836/bloxtor
 *
 * YOU ARE NOT AUTHORIZED TO MODIFY OR REMOVE ANY PART OF THIS NOTICE!
 */

var old_tables_names = {};
var old_tables_attributes_names = {};
var auto_sync_error_message_shown = false;
var is_workflow_already_loaded = false; //check if workflow was already loaded for the first time
var sync_with_db_server_called = false;

/* MENUS Methods */

function addNewTable() {
	var table_name = prompt("Please enter the table name:");
	
	if (table_name != null && ("" + table_name).replace(/\s+/, "") != "") {
		var label_obj = {label: table_name};
		
		//check if table already exists
		if (isTaskTableLabelValid(label_obj)) {
			var task_id = taskFlowChartObj.ContextMenu.addTaskByType("02466a6d");
			
			if (task_id) {
				taskFlowChartObj.TaskFlow.setTaskLabelByTaskId(task_id, label_obj); //set {label: table_name}, so the TaskFlow.setTaskLabel method ignores the prompt and adds the default label or an auto generated label.
			
				//add id, created_date and modified_date attributes by default
				var task_label = taskFlowChartObj.TaskFlow.getTaskLabelByTaskId(task_id);
				var task_property_values = taskFlowChartObj.TaskFlow.tasks_properties[task_id];
				task_property_values = DBTableTaskPropertyObj.prepareTaskPropertyValuesWithDefaultAttributes(task_property_values, task_label);
				taskFlowChartObj.TaskFlow.tasks_properties[task_id] = task_property_values;
				
				DBTableTaskPropertyObj.prepareShortTableAttributes(task_id, task_property_values);
				
				//open properties
				taskFlowChartObj.Property.showTaskProperties(task_id); //disable show proeprties bc is annoying
				
				 old_tables_names[task_id] = "";
				 old_tables_attributes_names[task_id] = {};
				
				return task_id;
			}
			else
				taskFlowChartObj.StatusMessage.showError("Could not add table '" + table_name + "' to diagram. Please try again...");
		}
	}
	else
		taskFlowChartObj.StatusMessage.showError("Table name cannot be empty!");
}

/* TASKFLOWCHART Callbacks */

function updateTasksAfterFileRead(data) {
	$(taskFlowChartObj.TaskFlow.target_selector).each(function(idx, elm) {
		var task_id = $(elm).attr("id");
		
		//update short foreign keys
		DBTableTaskPropertyObj.updateShortTableForeignKeys(task_id);
	});
}

/* DBTableTaskPropertyObj Callbacks */

function onLoadDBTableTaskProperties(properties_html_elm, task_id, task_property_values) {
	//set old_name field
	if (task_property_values && task_property_values.table_attr_names) {
		var task_html_elm = properties_html_elm.find('.db_table_task_html');
		var selector = task_html_elm.hasClass("attributes_list_shown") ? ".list_attributes .list_attrs" : ".table_attrs";
		var table_inputs = task_html_elm.find(selector + " .table_attr_name input");
		var simple_inputs = task_html_elm.find(".simple_attributes > ul > li .simple_attr_name");
		
		$.each(task_property_values.table_attr_names, function(i, table_attr_name) {
			var old_name = old_tables_attributes_names && old_tables_attributes_names[task_id] && old_tables_attributes_names[task_id][i] ? old_tables_attributes_names[task_id][i] : table_attr_name;
			
			var table_input = table_inputs[i];
			var simple_input = simple_inputs[i];
			
			if (table_input)
				table_input.setAttribute("old_name", old_name);
			
			if (simple_input)
				simple_input.setAttribute("old_name", old_name);
		});
	}
}

function onSubmitDBTableTaskProperties(properties_html_elm, task_id, task_property_values) {
	//updating old_tables_attributes_names with new attributes order
	var fields = DBTableTaskPropertyObj.getParsedTaskPropertyFields(properties_html_elm, task_id);
	var fields_names = fields.table_attr_names;
	
	if (fields_names) {
		var new_original_table_attributes_names = [];
		
		for (var i = 0; i < fields_names.length; i++) {
			var field_name = fields_names[i];
			var old_attribute_name = field_name.hasAttribute("old_name") ? field_name.getAttribute("old_name") : "";
			
			new_original_table_attributes_names.push(old_attribute_name);
		}
		
		old_tables_attributes_names[task_id] = new_original_table_attributes_names;
	}
	
	return true;
}

function onDBTableTaskCreation(task_id) {
	//backup original tables names for the sync action
	var table_name = taskFlowChartObj.TaskFlow.getTaskLabelByTaskId(task_id);
	var task_property_values = taskFlowChartObj.TaskFlow.tasks_properties[task_id];
	
	old_tables_names[task_id] = table_name;
	old_tables_attributes_names[task_id] = task_property_values && task_property_values.table_attr_names ? 
		$.map(assignObjectRecursively({}, task_property_values.table_attr_names), function(value, idx) { return [value]; }) //clone object/array and convert it to array
	: null;
}

function onDBTableTaskDeletion(task_id) {
	delete old_tables_names[task_id];
	delete old_tables_attributes_names[task_id];
}

function onUpdateSimpleAttributesHtmlWithTableAttributes(elm) {
	var task_html_elm = $(elm).closest(".db_table_task_html");
	var selector = task_html_elm.hasClass("attributes_list_shown") ? ".list_attributes .list_attrs" : ".table_attrs";
	var table_inputs = task_html_elm.find(selector + " .table_attr_name input");
	var simple_inputs = task_html_elm.find(".simple_attributes > ul li .simple_attr_name");
	
	//set old_names from table inputs to simple inputs
	$.each(table_inputs, function(idx, table_input) {
		var old_name = table_input.hasAttribute("old_name") ? table_input.getAttribute("old_name") : "";
		var simple_input = simple_inputs[idx];
		
		if (simple_input)
			simple_input.setAttribute("old_name", old_name);
	});
}

function onUpdateTableAttributesHtmlWithSimpleAttributes(elm) {
	var task_html_elm = $(elm).closest(".db_table_task_html");
	var table_inputs = task_html_elm.find(".table_attrs .table_attr_name input"); //no need to check the list_attributes .list_attrs, bc this function runs always with the .table_attrs
	var simple_inputs = task_html_elm.find(".simple_attributes > ul li .simple_attr_name");
	
	//set old_names from simple inputs to table inputs
	$.each(simple_inputs, function(idx, simple_input) {
		var old_name = simple_input.hasAttribute("old_name") ? simple_input.getAttribute("old_name") : "";
		var table_input = table_inputs[idx];
		
		if (table_input)
			table_input.setAttribute("old_name", old_name);
	});
}

function onAddTaskPropertiesAttribute(task_id, attribute_name, attribute_data, new_attribute_index) {
	var attribute_name = attribute_data["name"] ? attribute_data["name"] : null; //Do not use attribute_name bc it may be empty
	
	if ($.isArray(old_tables_attributes_names[task_id]))
		old_tables_attributes_names[task_id].push(attribute_name);
	else {
		if (!$.isPlainObject(old_tables_attributes_names[task_id]))
			old_tables_attributes_names[task_id] = {};
		
		old_tables_attributes_names[task_id][new_attribute_index] = attribute_name;
	}
}

function onBeforeRemoveTaskPropertiesAttribute(task_id, attribute_name) {
	var task_property_values = taskFlowChartObj.TaskFlow.tasks_properties[task_id];
	
	//remove attribute from task properties
	if (task_property_values && task_property_values.table_attr_names)
		$.each(task_property_values.table_attr_names, function(i, table_attr_name) {
			if (table_attr_name == attribute_name) {
				if ($.isArray(old_tables_attributes_names[task_id]))
					old_tables_attributes_names[task_id].splice(i, 1);
				else if ($.isPlainObject(old_tables_attributes_names[task_id]))
					delete old_tables_attributes_names[task_id][i];
				
				return false; //exit loop
			}
		});
	
	return true;
}

function onBeforeSortTaskPropertiesAttributes(task_id, attributes_names) {
	if (attributes_names) {
		var task_property_values = taskFlowChartObj.TaskFlow.tasks_properties[task_id];
		
		if (task_property_values && task_property_values.table_attr_names) {
			var table_attr_names = $.map(assignObjectRecursively({}, task_property_values.table_attr_names), function(value, idx) { return [value]; }); //clone object/array and convert it to array
			
			$.each(task_property_values.table_attr_names, function(i, table_attr_name) {
				var from_index = table_attr_names.indexOf(table_attr_name);
				var to_index = attributes_names.indexOf(table_attr_name);
				//console.log("attr "+table_attr_name + "("+from_index+" => "+to_index+")");
				
				if (to_index != -1 && to_index != from_index) {
					var arr = old_tables_attributes_names[task_id];
					
					//convert object to array
					if ($.isPlainObject(arr))
						arr = $.map(arr, function(value, idx){
							return [value];
						});
					
					//reorder array
					var value = arr.splice(from_index, 1)[0];
					arr.splice(to_index, 0, value);
					
					old_tables_attributes_names[task_id] = arr;
					
					//update table_attr_names
					var value = table_attr_names.splice(from_index, 1)[0];
					table_attr_names.splice(to_index, 0, value);
				}
			});
		}
	}
	
	return false;
}
