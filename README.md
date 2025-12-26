# PHP to Diagram

> Original Repos:   
> - PHP to Diagram: https://github.com/a19836/php-to-workflow-diagram/   
> - Bloxtor: https://github.com/a19836/bloxtor/

## Overview

**PHP to Diagram** is a library that enables **bidirectional conversion between PHP code and visual workflow diagrams**.  
It transforms PHP logic into **low-code, visual diagrams**, and converts those diagrams back into fully functional PHP code.

This approach allows **non-programmers** to design and maintain application logic visually, while still producing clean, structured, and executable PHP code. At the same time, developers benefit from a **controlled, standardized, and predictable architecture**, reducing errors and improving maintainability.

With this library, users can:
- Design application logic visually using workflows  
- Generate PHP code automatically from diagrams  
- Convert existing PHP logic into editable visual workflows  
- Enforce standardized logic patterns and execution flows  
- Reduce complexity while maintaining full control over application behavior  

This library bridges the gap between **low-code tools** and **traditional PHP development**, making it ideal for business logic modeling, workflow automation, and collaborative environments where both technical and non-technical users participate.

To better understand how diagram-to-code and code-to-diagram conversion works, please refer to this [Tutorial](https://bloxtor.com/onlineitframeworktutorial/?block_id=documentation/workflow_programming).   
   
> ### To see a working example, open [index.php](index.php) on your server.
   
---

## Requirements:

- jquerytaskflowchart
- jquerymystatusmessage
- myhtmlbeautify
- acecodeeditor
- phpparser

---

## Screenshots

- [example 1](./img/example_1.png)
- [example 2](./img/example_2.png)

---

### Features

- Convert PHP code into visual, low-code workflow diagrams  
- Generate fully functional PHP code from workflow diagrams  
- Enable bidirectional synchronization between diagrams and PHP source code  
- Allow non-programmers to build and maintain application logic visually  
- Enforce standardized and controlled execution flows  
- Reduce human error by validating logic at the workflow level  
- Support reusable workflow blocks and logic components  
- Provide clear separation between business logic and technical implementation  
- Allow developers to review, extend, and optimize generated PHP code  
- Ideal for workflow automation, business process modeling, and rule-based logic  
- Facilitate collaboration between technical and non-technical users  
- Improve maintainability by making application logic easier to understand and evolve  

---

## Usage

### Short Example:

```javascript
<script>
//call this function to convert the diagram into PHP code
generateCodeFromTasksFlow();

//call this function to convert the PHP code into a diagram
generateTasksFlowFromCode();
</script>
```

### Complete Example:

Similiar to [examples/index.php](./examples/).

```php
<?php
include_once __DIR__ . "/examples/init.php";

//define the file that the engine should get and set the workflow.
$path = !empty($_GET["path"]) ? $_GET["path"] : "code";
?>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<link rel="icon" href="data:;base64,=" />
	
	<!-- DIAGRAM -->
	<link rel="stylesheet" href="examples/css/global.css" type="text/css" charset="utf-8" />
	<link rel="stylesheet" href="examples/css/bloxtor_global.css" type="text/css" charset="utf-8" />
	<script language="javascript" type="text/javascript" src="examples/js/global.js"></script>
	
	<!-- DIAGRAM - Add Fontawsome Icons CSS -->
	<link rel="stylesheet" href="jquerytaskflowchart/examples/logic_workflow/lib/fontawesome/css/all.min.css">

	<!-- DIAGRAM - Add Icons CSS files -->
	<link rel="stylesheet" href="examples/css/icons.css" type="text/css" charset="utf-8" />

	<!-- DIAGRAM - Colors -->
	<script language="javascript" type="text/javascript" src="jquerytaskflowchart/examples/logic_workflow/js/color.js"></script>
	
	<!-- DIAGRAM - Add jquery lib -->
	<script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/jquery/js/jquery-1.8.1.min.js"></script>
	<script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/jquery/js/jquery.center.js"></script>
	
	<!-- DIAGRAM - Add Jquery UI JS and CSS files -->
	<link rel="stylesheet" href="jquerytaskflowchart/lib/jqueryui/css/jquery-ui-1.11.4.css" type="text/css" />
	<script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/jqueryui/js/jquery-ui-1.11.4.min.js"></script>
	
	<!-- DIAGRAM - Add Jquery Tap-Hold Event JS file -->
	<script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/jquerytaphold/taphold.js"></script>

	<!-- DIAGRAM - Jquery Touch Punch to work on mobile devices with touch -->
	<script type="text/javascript" src="jquerytaskflowchart/lib/jqueryuitouchpunch/jquery.ui.touch-punch.min.js"></script>
	
	<!-- DIAGRAM - Add Fancy LighBox lib -->
	<link rel="stylesheet" href="jquerytaskflowchart/lib/jquerymyfancylightbox/css/style.css" type="text/css" charset="utf-8" media="screen, projection" />
	<script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/jquerymyfancylightbox/js/jquery.myfancybox.js"></script>

	<!-- DIAGRAM - Add LeaderLine main JS and CSS files -->
	<link rel="stylesheet" href="jquerytaskflowchart/lib/leaderline/leader-line.css" type="text/css" charset="utf-8" />
	<script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/leaderline/leader-line.js"></script>
	<script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/leaderline/LeaderLineFlowHandler.js"></script>

	<!-- DIAGRAM - Add TaskFlowChart main JS and CSS files -->
	<link rel="stylesheet" href="jquerytaskflowchart/css/style.css" type="text/css" charset="utf-8" />
	<link rel="stylesheet" href="jquerytaskflowchart/css/print.css" type="text/css" charset="utf-8" media="print" />
	<script type="text/javascript" src="jquerytaskflowchart/js/ExternalLibHandler.js"></script>
	<script type="text/javascript" src="jquerytaskflowchart/js/TaskFlowChart.js"></script>

	<!-- DIAGRAM - Add ContextMenu main JS and CSS files -->
	<link rel="stylesheet" href="jquerytaskflowchart/lib/jquerymycontextmenu/css/style.css" type="text/css" charset="utf-8" />
	<script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/jquerymycontextmenu/js/jquery.mycontextmenu.js"></script>

	<!-- DIAGRAM - Parse_Str -->
	<script type="text/javascript" src="jquerytaskflowchart/lib/phpjs/functions/strings/parse_str.js"></script>

	<!-- DIAGRAM - Add DropDowns main JS and CSS files -->
	<link rel="stylesheet" href="jquerytaskflowchart/lib/jquerysimpledropdowns/css/style.css" type="text/css" charset="utf-8" />
	<!--[if lte IE 7]>
		 <link rel="stylesheet" href="jquerytaskflowchart/lib/jquerysimpledropdowns/css/ie.css" type="text/css" charset="utf-8" />
	<![endif]-->
	<script language="javascript" type="text/javascript" src="jquerytaskflowchart/lib/jquerysimpledropdowns/js/jquery.dropdownPlain.js"></script>
	
	<!-- DIAGRAM - Add Menus JS file -->
	<script language="javascript" type="text/javascript" src="jquerytaskflowchart/js/menu.js"></script>
	
	<!-- DIAGRAM - Add TASKS JS and CSS files -->
	<?php echo printTasksCSSAndJS($tasks_settings, $webroot_cache_folder_path, $webroot_cache_folder_url); ?>
	
	<!-- CODE -->
	<!-- CODE - Add ACE-Editor -->
	<script type="text/javascript" src="vendor/acecodeeditor/src-min-noconflict/ace.js"></script>
	<script type="text/javascript" src="vendor/acecodeeditor/src-min-noconflict/ext-language_tools.js"></script>
	
	<!-- CODE - Message -->
	<link rel="stylesheet" href="vendor/jquerymystatusmessage/css/style.css" type="text/css" charset="utf-8" />
	<script language="javascript" type="text/javascript" src="vendor/jquerymystatusmessage/js/statusmessage.js"></script>
	
	<!-- CODE - (optional) Add Code Beautifier -->
	<script language="javascript" type="text/javascript" src="vendor/myhtmlbeautify/vendor/mycodebeautifier/js/MyCodeBeautifier.js"></script>

	<!-- CODE - (optional) Add Html/CSS/JS Beautify code -->
	<script language="javascript" type="text/javascript" src="vendor/myhtmlbeautify/vendor/jsbeautify/js/lib/beautify.js"></script>
	<script language="javascript" type="text/javascript" src="vendor/myhtmlbeautify/vendor/jsbeautify/js/lib/beautify-css.js"></script>
	
	<!-- CODE - Add MyHtmlBeautify code -->
	<script language="javascript" type="text/javascript" src="vendor/myhtmlbeautify/MyHtmlBeautify.js"></script>
	
	<!-- LOCAL -->
	<link rel="stylesheet" type="text/css" href="examples/css/bloxtor_layout.css" />
	<link rel="stylesheet" type="text/css" href="examples/css/style.css" />
	<script type="text/javascript" src="examples/js/script.js"></script>
	
	<script>
		var diagram_to_code_url = "examples/server/create_code_from_workflow_file.php?path=<?php echo $path; ?>_tmp";
		var code_to_diagram_url = "examples/server/create_workflow_file_from_code.php?path=<?php echo $path; ?>_tmp";
		var get_tasks_file_url = "examples/server/get_workflow_file.php?path=<?php echo $path; ?>";
		var set_tasks_file_url = "examples/server/set_workflow_file.php?path=<?php echo $path; ?>";
		var set_tmp_tasks_file_url = set_tasks_file_url + "_tmp";
		var get_tmp_tasks_file_url = get_tasks_file_url + "_tmp";
		var set_code_file_url = "server/set_code_file.php?path=<?php echo $path; ?>";
		var get_code_file_url = "server/get_code_file.php?path=<?php echo $path; ?>";
		
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
			taskFlowChartObj.Property.tasks_settings = <?php echo getTasksSettingsObj($tasks_settings); ?>;
			taskFlowChartObj.Container.tasks_containers = <?php echo getTasksContainersByTaskType($tasks_containers); ?>;
			
			taskFlowChartObj.init();
		})();
	</script>
</head>
<body>
	<div class="phptoworkflow ">
		<ul class="tabs">
			<li><a href="#code">Code</a></li>
			<li><a href="#ui">UI</a></li>
		</ul>
		
		<div id="code" class="code">
			<!-- CODE MENU -->
			<div id="code_menu" class="code_menu menu">
				<ul class="dropdown">
					<li class="" title="Save">
						<a onClick="saveCode();return false;"><i class="icon save"></i> Save</a>
					</li>
					<li class="" title="Generate Code From Diagram">
						<a onClick="generateCodeFromTasksFlow();return false;"><i class="icon generate_code_from_tasks_flow"></i> Generate Code From Diagram</a>
					</li>
				</ul>
			</div>
			<textarea></textarea>
		</div>
		
		<!-- Task Flow Chart -->
		<div id="ui" class="">
			<div id="taskflowchart" class="taskflowchart reverse resizable_task_properties resizable_connection_properties with_top_bar_menu fixed_side_properties auto_save_disabled">
			
				<!-- WORKFLOW MENU -->
				<div id="workflow_menu" class="workflow_menu menu">
					<ul class="dropdown">
						<li class="" title="Save">
							<a onClick="taskFlowChartObj.TaskFile.save();return false;"><i class="icon save"></i> Save</a>
						</li>
						<li class="" title="Generate Diagram From Code">
							<a onClick="generateTasksFlowFromCode();return false;"><i class="icon generate_tasks_flow_from_code"></i> Generate Diagram From Code</a>
						</li>
					</ul>
				</div>
				
				<!-- TASKS SIDE BAR -->
				<div class="tasks_menu scroll">
					<?php echo printTasksList($tasks_settings, $tasks_groups_by_tag, $tasks_order_by_tag); ?>
				</div>
				
				<!-- TASKS MENU HIDE -->
				<div class="tasks_menu_hide">
					<div class="button" onclick="taskFlowChartObj.ContextMenu.toggleTasksMenuPanel(this)"></div>
				</div>
				
				<!-- TASKS FLOW - CANVAS -->
				<div class="tasks_flow scroll">
					<?php echo printTasksContainers($tasks_containers); ?>
				</div>
				
				<!-- TASKS PROPERTIES -->
				<div class="tasks_properties hidden">
					<?php echo printTasksProperties($tasks_settings, $tasks_order_by_tag); ?>
				</div>
				
				<!-- CONNECTION PROPERTIES -->
				<div class="connections_properties hidden">
					<?php echo printConnectionsProperties($tasks_settings); ?>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
```

## Extend Diagram Tasks

To create a new tasks you should follow this [tutorial](https://bloxtor.com/onlineitframeworktutorial/?block_id=documentation/workflow_programming/tasks_creation).
But here it is a Task XML sample:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<task>
	<label></label>
	<tag></tag>
	<!--files>
		<task_properties_html>WorkFlowTaskHtml.php</task_properties_html>
		<connection_properties_html>WorkFlowConnectionHtml.php</task_properties_html>
		<css>css/WorkFlowTask.css</css>
		<js>js/WorkFlowTask.js</js>
	</files-->
	<!--css></css-->
	<settings>
		<!--js_code></js_code-->
		<task_menu>
			<!--show_context_menu>0</show_context_menu>
			<show_set_label_menu>0</show_set_label_menu>
			<show_properties_menu>0</show_properties_menu>
			<show_start_task_menu>0</show_start_task_menu>
			<show_delete_menu>false</show_delete_menu-->
		</task_menu>
		<connection_menu>
			<!--show_context_menu>0</show_context_menu>
			<show_set_label_menu>0</show_set_label_menu>
			<show_properties_menu>0</show_properties_menu>
			<show_connector_types_menu>0</show_connector_types_menu>
			<show_overlay_types_menu>0</show_overlay_types_menu>
			<show_delete_menu>false</show_delete_menu-->
		</connection_menu>
		<callback>
			<on_load_task_properties></on_load_task_properties>
			<on_submit_task_properties></on_submit_task_properties>
			<on_complete_task_properties></on_complete_task_properties>
			<on_cancel_task_properties></on_cancel_task_properties>
			
			<on_load_connection_properties></on_load_connection_properties>
			<on_submit_connection_properties></on_submit_connection_properties>
			<on_complete_connection_properties></on_complete_connection_properties>
			<on_cancel_connection_properties></on_cancel_connection_properties>
			
			<on_start_task_label></on_start_task_label>
			<on_check_task_label></on_check_task_label>
			<on_submit_task_label></on_submit_task_label>
			<on_cancel_task_label></on_cancel_task_label>
			<on_complete_task_label></on_complete_task_label>
			
			<on_check_connection_label></on_check_connection_label>
			<on_submit_connection_label></on_submit_connection_label>
			<on_cancel_connection_label></on_cancel_connection_label>
			<on_complete_connection_label></on_complete_connection_label>
			
			<on_success_task_cloning></on_success_task_cloning>
			<on_success_task_append></on_success_task_append>
			<on_success_task_creation></on_success_task_creation>
			<on_check_task_deletion></on_check_task_deletion>
			<on_success_task_deletion></on_success_task_deletion>
			<on_task_drag_stop_validation></on_task_drag_stop_validation>
			<on_task_drag_stop_end></on_task_drag_stop_end>
			
			<on_success_task_between_connection></on_success_task_between_connection>
			<on_success_connection_drag></on_success_connection_drag>
			<on_success_connection_drop></on_success_connection_drop>
			<on_success_connection_deletion></on_success_connection_deletion>
			
			<on_show_task_menu></on_show_task_menu>
			<on_show_connection_menu></on_show_connection_menu>
			
			<on_click_task></on_click_task>
			<on_click_connection></on_click_connection>
		</callback>
		<center_inner_elements></center_inner_elements>
		<is_resizable_task></is_resizable_task>
		<allow_inner_tasks_outside_connections>1</allow_inner_tasks_outside_connections>
	</settings>
	<code_parser>
		<statements></statements>
		<reserved_static_method_class_names></reserved_static_method_class_names>
		<reserved_object_method_names></reserved_object_method_names>
		<reserved_function_names></reserved_function_names>
	</code_parser>
</task>
```

