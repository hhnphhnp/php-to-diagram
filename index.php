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

include_once __DIR__ . "/examples/config.php";

echo $style;
?>
<h1>PHP to Diagram</h1>
<p>Converts code to diagram and diagram to code</p>
<div class="note">
		<span>
		This library enables <b>bidirectional conversion between PHP code and visual workflow diagrams</b>.<br/>
It transforms PHP logic into <b>low-code, visual diagrams</b>, and converts those diagrams back into fully functional PHP code.<br/>
		<br/>
		This approach allows <b>non-programmers</b> to design and maintain application logic visually, while still producing clean, structured, and executable PHP code. At the same time, developers benefit from a <b>controlled, standardized, and predictable architecture</b>, reducing errors and improving maintainability.<br/>
		<br/>
		With this library, users can:<br/>
		<ul style="display:inline-block; text-align:left;">
			<li>Design application logic visually using workflows</li>
			<li>Generate PHP code automatically from diagrams</li>
			<li>Convert existing PHP logic into editable visual workflows</li>
			<li>Enforce standardized logic patterns and execution flows</li>
			<li>Reduce complexity while maintaining full control over application behavior</li>
		</ul>
		<br/>
		This library bridges the gap between <b>low-code tools</b> and <b>traditional PHP development</b>, making it ideal for business logic modeling, workflow automation, and collaborative environments where both technical and non-technical users participate.<br/>
		<br/>
		To better understand how diagram-to-code and code-to-diagram conversion works, please refer to this <a href="https://bloxtor.com/onlineitframeworktutorial/?block_id=documentation/workflow_programming" target="diagram_tutorial">tutorial</a>.
		</span>
</div>
<div style="text-align:center;">
	<h3>
		<a href="examples/" target="examples">Click here to check an example</a>
	</h3>
</div>

<div>
	<h5>Usage sample:</h5>
	<div class="code short">
		<textarea readonly>
&lt;script>
//call this function to convert the diagram into PHP code
generateCodeFromTasksFlow();

//call this function to convert the PHP code into a diagram
generateTasksFlowFromCode();
&lt;/script>
		</textarea>
	</div>
</div>

<div>
	<h5>Complete usage sample: <span style="font-weight:normal">(similiar to <a href="examples/" target="examples">examples/index.php</a>)</span></h5>
	<div class="code">
		<textarea readonly>
&lt;?php
include_once __DIR__ . "/examples/init.php";

//define the file that the engine should get and set the workflow.
$path = !empty($_GET["path"]) ? $_GET["path"] : "code";
?>
&lt;html>
&lt;head>
	&lt;meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	&lt;link rel="icon" href="data:;base64,=" />
	
	&lt;!-- DIAGRAM -->
	&lt;link rel="stylesheet" href="examples/css/global.css" type="text/css" charset="utf-8" />
	&lt;link rel="stylesheet" href="examples/css/bloxtor_global.css" type="text/css" charset="utf-8" />
	&lt;script language="javascript" type="text/javascript" src="examples/js/global.js">&lt;/script>
	
	&lt;!-- DIAGRAM - Add Fontawsome Icons CSS -->
	&lt;link rel="stylesheet" href="jquerytaskflowchart/examples/logic_workflow/lib/fontawesome/css/all.min.css">

	&lt;!-- DIAGRAM - Add Icons CSS files -->
	&lt;link rel="stylesheet" href="examples/css/icons.css" type="text/css" charset="utf-8" />

	&lt;!-- DIAGRAM - Colors -->
	&lt;script language="javascript" type="text/javascript" src="jquerytaskflowchart/examples/logic_workflow/js/color.js">&lt;/script>
	
	&lt;!-- DIAGRAM - Add jquery lib -->
	&lt;script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/jquery/js/jquery-1.8.1.min.js">&lt;/script>
	&lt;script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/jquery/js/jquery.center.js">&lt;/script>
	
	&lt;!-- DIAGRAM - Add Jquery UI JS and CSS files -->
	&lt;link rel="stylesheet" href="jquerytaskflowchart/lib/jqueryui/css/jquery-ui-1.11.4.css" type="text/css" />
	&lt;script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/jqueryui/js/jquery-ui-1.11.4.min.js">&lt;/script>
	
	&lt;!-- DIAGRAM - Add Jquery Tap-Hold Event JS file -->
	&lt;script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/jquerytaphold/taphold.js">&lt;/script>

	&lt;!-- DIAGRAM - Jquery Touch Punch to work on mobile devices with touch -->
	&lt;script type="text/javascript" src="jquerytaskflowchart/lib/jqueryuitouchpunch/jquery.ui.touch-punch.min.js">&lt;/script>
	
	&lt;!-- DIAGRAM - Add Fancy LighBox lib -->
	&lt;link rel="stylesheet" href="jquerytaskflowchart/lib/jquerymyfancylightbox/css/style.css" type="text/css" charset="utf-8" media="screen, projection" />
	&lt;script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/jquerymyfancylightbox/js/jquery.myfancybox.js">&lt;/script>

	&lt;!-- DIAGRAM - Add LeaderLine main JS and CSS files -->
	&lt;link rel="stylesheet" href="jquerytaskflowchart/lib/leaderline/leader-line.css" type="text/css" charset="utf-8" />
	&lt;script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/leaderline/leader-line.js">&lt;/script>
	&lt;script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/leaderline/LeaderLineFlowHandler.js">&lt;/script>

	&lt;!-- DIAGRAM - Add TaskFlowChart main JS and CSS files -->
	&lt;link rel="stylesheet" href="jquerytaskflowchart/css/style.css" type="text/css" charset="utf-8" />
	&lt;link rel="stylesheet" href="jquerytaskflowchart/css/print.css" type="text/css" charset="utf-8" media="print" />
	&lt;script type="text/javascript" src="jquerytaskflowchart/js/ExternalLibHandler.js">&lt;/script>
	&lt;script type="text/javascript" src="jquerytaskflowchart/js/TaskFlowChart.js">&lt;/script>

	&lt;!-- DIAGRAM - Add ContextMenu main JS and CSS files -->
	&lt;link rel="stylesheet" href="jquerytaskflowchart/lib/jquerymycontextmenu/css/style.css" type="text/css" charset="utf-8" />
	&lt;script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/jquerymycontextmenu/js/jquery.mycontextmenu.js">&lt;/script>

	&lt;!-- DIAGRAM - Parse_Str -->
	&lt;script type="text/javascript" src="jquerytaskflowchart/lib/phpjs/functions/strings/parse_str.js">&lt;/script>

	&lt;!-- DIAGRAM - Add DropDowns main JS and CSS files -->
	&lt;link rel="stylesheet" href="jquerytaskflowchart/lib/jquerysimpledropdowns/css/style.css" type="text/css" charset="utf-8" />
	&lt;!--[if lte IE 7]>
		 &lt;link rel="stylesheet" href="jquerytaskflowchart/lib/jquerysimpledropdowns/css/ie.css" type="text/css" charset="utf-8" />
	&lt;![endif]-->
	&lt;script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/jquerysimpledropdowns/js/jquery.dropdownPlain.js">&lt;/script>
	
	&lt;!-- DIAGRAM - Add Menus JS file -->
	&lt;script language="javascript" type="text/javascript" src="jquerytaskflowchart/js/menu.js">&lt;/script>
	
	&lt;!-- DIAGRAM - Add TASKS JS and CSS files -->
	&lt;?php echo printTasksCSSAndJS($tasks_settings, $webroot_cache_folder_path, $webroot_cache_folder_url); ?>
	
	&lt;!-- CODE -->
	&lt;!-- CODE - Add ACE-Editor -->
	&lt;script type="text/javascript" src="vendor/acecodeeditor/src-min-noconflict/ace.js">&lt;/script>
	&lt;script type="text/javascript" src="vendor/acecodeeditor/src-min-noconflict/ext-language_tools.js">&lt;/script>
	
	&lt;!-- CODE - Message -->
	&lt;link rel="stylesheet" href="vendor/jquerymystatusmessage/css/style.css" type="text/css" charset="utf-8" />
	&lt;script language="javascript" type="text/javascript" src="vendor/jquerymystatusmessage/js/statusmessage.js">&lt;/script>
	
	&lt;!-- CODE - (optional) Add Code Beautifier -->
	&lt;script language="javascript" type="text/javascript" src="vendor/myhtmlbeautify/vendor/mycodebeautifier/js/MyCodeBeautifier.js">&lt;/script>

	&lt;!-- CODE - (optional) Add Html/CSS/JS Beautify code -->
	&lt;script language="javascript" type="text/javascript" src="vendor/myhtmlbeautify/vendor/jsbeautify/js/lib/beautify.js">&lt;/script>
	&lt;script language="javascript" type="text/javascript" src="vendor/myhtmlbeautify/vendor/jsbeautify/js/lib/beautify-css.js">&lt;/script>
	
	&lt;!-- CODE - Add MyHtmlBeautify code -->
	&lt;script language="javascript" type="text/javascript" src="vendor/myhtmlbeautify/MyHtmlBeautify.js">&lt;/script>
	
	&lt;!-- LOCAL -->
	&lt;link rel="stylesheet" type="text/css" href="examples/css/bloxtor_layout.css" />
	&lt;link rel="stylesheet" type="text/css" href="examples/css/style.css" />
	&lt;script type="text/javascript" src="examples/js/script.js">&lt;/script>
	
	&lt;script>
		var diagram_to_code_url = "examples/server/create_code_from_workflow_file.php?path=&lt;?php echo $path; ?>_tmp";
		var code_to_diagram_url = "examples/server/create_workflow_file_from_code.php?path=&lt;?php echo $path; ?>_tmp";
		var get_tasks_file_url = "examples/server/get_workflow_file.php?path=&lt;?php echo $path; ?>";
		var set_tasks_file_url = "examples/server/set_workflow_file.php?path=&lt;?php echo $path; ?>";
		var set_tmp_tasks_file_url = set_tasks_file_url + "_tmp";
		var get_tmp_tasks_file_url = get_tasks_file_url + "_tmp";
		var set_code_file_url = "server/set_code_file.php?path=&lt;?php echo $path; ?>";
		var get_code_file_url = "server/get_code_file.php?path=&lt;?php echo $path; ?>";
		
		;(function() {
			taskFlowChartObj.setTaskFlowChartObjOption("is_droppable_connection", true);
			taskFlowChartObj.setTaskFlowChartObjOption("add_default_start_task", true);
			taskFlowChartObj.setTaskFlowChartObjOption("resizable_task_properties", true);
			taskFlowChartObj.setTaskFlowChartObjOption("resizable_connection_properties", true);
			
			taskFlowChartObj.TaskFile.get_tasks_file_url = get_tasks_file_url;
			taskFlowChartObj.TaskFile.set_tasks_file_url = set_tasks_file_url;
			taskFlowChartObj.TaskFlow.default_connection_connector = "Straight";
			taskFlowChartObj.TaskFlow.default_connection_hover_color = null;
			taskFlowChartObj.TaskFlow.main_tasks_flow_obj_id = "taskflowchart > .tasks_flow";
			taskFlowChartObj.TaskFlow.main_tasks_properties_obj_id = "taskflowchart > .tasks_properties";
			taskFlowChartObj.TaskFlow.main_connections_properties_obj_id = "taskflowchart > .connections_properties";
			taskFlowChartObj.ContextMenu.main_tasks_menu_obj_id = "taskflowchart > .tasks_menu";
			taskFlowChartObj.ContextMenu.main_tasks_menu_hide_obj_id = "taskflowchart > .tasks_menu_hide";
			taskFlowChartObj.ContextMenu.main_workflow_menu_obj_id = "taskflowchart > .workflow_menu";
			
			taskFlowChartObj.Property.tasks_settings = {};
			taskFlowChartObj.Property.tasks_settings = &lt;?php echo getTasksSettingsObj($tasks_settings); ?>;
			taskFlowChartObj.Container.tasks_containers = &lt;?php echo getTasksContainersByTaskType($tasks_containers); ?>;
			
			taskFlowChartObj.init();
		})();
	&lt;/script>
&lt;/head>
&lt;body>
	&lt;div class="phptoworkflow ">
		&lt;ul class="tabs">
			&lt;li>&lt;a href="#code">Code&lt;/a>&lt;/li>
			&lt;li>&lt;a href="#ui">UI&lt;/a>&lt;/li>
		&lt;/ul>
		
		&lt;div id="code" class="code">
			&lt;!-- CODE MENU -->
			&lt;div id="code_menu" class="code_menu menu">
				&lt;ul class="dropdown">
					&lt;li class="" title="Save">
						&lt;a onClick="saveCode();return false;">&lt;i class="icon save">&lt;/i> Save&lt;/a>
					&lt;/li>
					&lt;li class="" title="Generate Code From Diagram">
						&lt;a onClick="generateCodeFromTasksFlow();return false;">&lt;i class="icon generate_code_from_tasks_flow">&lt;/i> Generate Code From Diagram&lt;/a>
					&lt;/li>
				&lt;/ul>
			&lt;/div>
			&lt;textarea>&lt;/textarea>
		&lt;/div>
		
		&lt;!-- Task Flow Chart -->
		&lt;div id="ui" class="">
			&lt;div id="taskflowchart" class="taskflowchart reverse resizable_task_properties resizable_connection_properties with_top_bar_menu fixed_side_properties auto_save_disabled">
			
				&lt;!-- WORKFLOW MENU -->
				&lt;div id="workflow_menu" class="workflow_menu menu">
					&lt;ul class="dropdown">
						&lt;li class="" title="Save">
							&lt;a onClick="taskFlowChartObj.TaskFile.save();return false;">&lt;i class="icon save">&lt;/i> Save&lt;/a>
						&lt;/li>
						&lt;li class="" title="Generate Diagram From Code">
							&lt;a onClick="generateTasksFlowFromCode();return false;">&lt;i class="icon generate_tasks_flow_from_code">&lt;/i> Generate Diagram From Code&lt;/a>
						&lt;/li>
					&lt;/ul>
				&lt;/div>
				
				&lt;!-- TASKS SIDE BAR -->
				&lt;div class="tasks_menu scroll">
					&lt;?php echo printTasksList($tasks_settings, $tasks_groups_by_tag, $tasks_order_by_tag); ?>
				&lt;/div>
				
				&lt;!-- TASKS MENU HIDE -->
				&lt;div class="tasks_menu_hide">
					&lt;div class="button" onclick="taskFlowChartObj.ContextMenu.toggleTasksMenuPanel(this)">&lt;/div>
				&lt;/div>
				
				&lt;!-- TASKS FLOW - CANVAS -->
				&lt;div class="tasks_flow scroll">
					&lt;?php echo printTasksContainers($tasks_containers); ?>
				&lt;/div>
				
				&lt;!-- TASKS PROPERTIES -->
				&lt;div class="tasks_properties hidden">
					&lt;?php echo printTasksProperties($tasks_settings, $tasks_order_by_tag); ?>
				&lt;/div>
				
				&lt;!-- CONNECTION PROPERTIES -->
				&lt;div class="connections_properties hidden">
					&lt;?php echo printConnectionsProperties($tasks_settings); ?>
				&lt;/div>
			&lt;/div>
		&lt;/div>
	&lt;/div>
&lt;/body>
&lt;/html>
		</textarea>
	</div>
</div>

<div>
	<h5>Extend diagram tasks:</h5>
	<p style="text-align:left;">To create a new tasks you should follow this <a href="https://bloxtor.com/onlineitframeworktutorial/?block_id=documentation/workflow_programming/tasks_creation" target="new_task">tutorial</a>.<br/>
		But here it is a Task XML sample:
	</p>
	<div class="code xml">
		<textarea readonly>
&lt;?xml version="1.0" encoding="UTF-8"?>
&lt;task>
	&lt;label>&lt;/label>
	&lt;tag>&lt;/tag>
	&lt;!--files>
		&lt;task_properties_html>WorkFlowTaskHtml.php&lt;/task_properties_html>
		&lt;connection_properties_html>WorkFlowConnectionHtml.php&lt;/task_properties_html>
		&lt;css>css/WorkFlowTask.css&lt;/css>
		&lt;js>js/WorkFlowTask.js&lt;/js>
	&lt;/files-->
	&lt;!--css>&lt;/css-->
	&lt;settings>
		&lt;!--js_code>&lt;/js_code-->
		&lt;task_menu>
			&lt;!--show_context_menu>0&lt;/show_context_menu>
			&lt;show_set_label_menu>0&lt;/show_set_label_menu>
			&lt;show_properties_menu>0&lt;/show_properties_menu>
			&lt;show_start_task_menu>0&lt;/show_start_task_menu>
			&lt;show_delete_menu>false&lt;/show_delete_menu-->
		&lt;/task_menu>
		&lt;connection_menu>
			&lt;!--show_context_menu>0&lt;/show_context_menu>
			&lt;show_set_label_menu>0&lt;/show_set_label_menu>
			&lt;show_properties_menu>0&lt;/show_properties_menu>
			&lt;show_connector_types_menu>0&lt;/show_connector_types_menu>
			&lt;show_overlay_types_menu>0&lt;/show_overlay_types_menu>
			&lt;show_delete_menu>false&lt;/show_delete_menu-->
		&lt;/connection_menu>
		&lt;callback>
			&lt;on_load_task_properties>&lt;/on_load_task_properties>
			&lt;on_submit_task_properties>&lt;/on_submit_task_properties>
			&lt;on_complete_task_properties>&lt;/on_complete_task_properties>
			&lt;on_cancel_task_properties>&lt;/on_cancel_task_properties>
			
			&lt;on_load_connection_properties>&lt;/on_load_connection_properties>
			&lt;on_submit_connection_properties>&lt;/on_submit_connection_properties>
			&lt;on_complete_connection_properties>&lt;/on_complete_connection_properties>
			&lt;on_cancel_connection_properties>&lt;/on_cancel_connection_properties>
			
			&lt;on_start_task_label>&lt;/on_start_task_label>
			&lt;on_check_task_label>&lt;/on_check_task_label>
			&lt;on_submit_task_label>&lt;/on_submit_task_label>
			&lt;on_cancel_task_label>&lt;/on_cancel_task_label>
			&lt;on_complete_task_label>&lt;/on_complete_task_label>
			
			&lt;on_check_connection_label>&lt;/on_check_connection_label>
			&lt;on_submit_connection_label>&lt;/on_submit_connection_label>
			&lt;on_cancel_connection_label>&lt;/on_cancel_connection_label>
			&lt;on_complete_connection_label>&lt;/on_complete_connection_label>
			
			&lt;on_success_task_cloning>&lt;/on_success_task_cloning>
			&lt;on_success_task_append>&lt;/on_success_task_append>
			&lt;on_success_task_creation>&lt;/on_success_task_creation>
			&lt;on_check_task_deletion>&lt;/on_check_task_deletion>
			&lt;on_success_task_deletion>&lt;/on_success_task_deletion>
			&lt;on_task_drag_stop_validation>&lt;/on_task_drag_stop_validation>
			&lt;on_task_drag_stop_end>&lt;/on_task_drag_stop_end>
			
			&lt;on_success_task_between_connection>&lt;/on_success_task_between_connection>
			&lt;on_success_connection_drag>&lt;/on_success_connection_drag>
			&lt;on_success_connection_drop>&lt;/on_success_connection_drop>
			&lt;on_success_connection_deletion>&lt;/on_success_connection_deletion>
			
			&lt;on_show_task_menu>&lt;/on_show_task_menu>
			&lt;on_show_connection_menu>&lt;/on_show_connection_menu>
			
			&lt;on_click_task>&lt;/on_click_task>
			&lt;on_click_connection>&lt;/on_click_connection>
		&lt;/callback>
		&lt;center_inner_elements>&lt;/center_inner_elements>
		&lt;is_resizable_task>&lt;/is_resizable_task>
		&lt;allow_inner_tasks_outside_connections>1&lt;/allow_inner_tasks_outside_connections>
	&lt;/settings>
	&lt;code_parser>
		&lt;statements>&lt;/statements>
		&lt;reserved_static_method_class_names>&lt;/reserved_static_method_class_names>
		&lt;reserved_object_method_names>&lt;/reserved_object_method_names>
		&lt;reserved_function_names>&lt;/reserved_function_names>
	&lt;/code_parser>
&lt;/task>
		</textarea>
	</div>
</div>

