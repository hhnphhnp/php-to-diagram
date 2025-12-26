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

include_once __DIR__ . "/init.php";

//define the file that the engine should get and set the workflow.
$path = !empty($_GET["path"]) ? $_GET["path"] : "code";
$extension = "json"; //available extensions: json or xml
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<link rel="icon" href="data:;base64,=" />
	
	<!-- DIAGRAM -->
	<link rel="stylesheet" href="css/global.css" type="text/css" charset="utf-8" />
	<link rel="stylesheet" href="css/bloxtor_global.css" type="text/css" charset="utf-8" />
	<script language="javascript" type="text/javascript" src="js/global.js"></script>
	
	<!-- DIAGRAM - Add Fontawsome Icons CSS -->
	<link rel="stylesheet" href="../jquerytaskflowchart/examples/logic_workflow/lib/fontawesome/css/all.min.css">

	<!-- DIAGRAM - Add Icons CSS files -->
	<link rel="stylesheet" href="css/icons.css" type="text/css" charset="utf-8" />

	<!-- DIAGRAM - Colors -->
	<script language="javascript" type="text/javascript" src="../jquerytaskflowchart/examples/logic_workflow/js/color.js"></script>
	
	<!-- DIAGRAM - Add jquery lib -->
	<script language="javascript" type="text/javascript" src="../jquerytaskflowchart/lib/jquery/js/jquery-1.8.1.min.js"></script>
	<script language="javascript" type="text/javascript" src="../jquerytaskflowchart/lib/jquery/js/jquery.center.js"></script>
	
	<!-- DIAGRAM - Add Jquery UI JS and CSS files -->
	<link rel="stylesheet" href="../jquerytaskflowchart/lib/jqueryui/css/jquery-ui-1.11.4.css" type="text/css" />
	<script language="javascript" type="text/javascript" src="../jquerytaskflowchart/lib/jqueryui/js/jquery-ui-1.11.4.min.js"></script>
	
	<!-- DIAGRAM - Add Jquery Tap-Hold Event JS file -->
	<script language="javascript" type="text/javascript" src="../jquerytaskflowchart/lib/jquerytaphold/taphold.js"></script>

	<!-- DIAGRAM - Jquery Touch Punch to work on mobile devices with touch -->
	<script type="text/javascript" src="../jquerytaskflowchart/lib/jqueryuitouchpunch/jquery.ui.touch-punch.min.js"></script>
	
	<!-- DIAGRAM - Add Fancy LighBox lib -->
	<link rel="stylesheet" href="../jquerytaskflowchart/lib/jquerymyfancylightbox/css/style.css" type="text/css" charset="utf-8" media="screen, projection" />
	<script language="javascript" type="text/javascript" src="../jquerytaskflowchart/lib/jquerymyfancylightbox/js/jquery.myfancybox.js"></script>

	<!-- DIAGRAM - Add LeaderLine main JS and CSS files -->
	<link rel="stylesheet" href="../jquerytaskflowchart/lib/leaderline/leader-line.css" type="text/css" charset="utf-8" />
	<script language="javascript" type="text/javascript" src="../jquerytaskflowchart/lib/leaderline/leader-line.js"></script>
	<script language="javascript" type="text/javascript" src="../jquerytaskflowchart/lib/leaderline/LeaderLineFlowHandler.js"></script>

	<!-- DIAGRAM - Add TaskFlowChart main JS and CSS files -->
	<link rel="stylesheet" href="../jquerytaskflowchart/css/style.css" type="text/css" charset="utf-8" />
	<link rel="stylesheet" href="../jquerytaskflowchart/css/print.css" type="text/css" charset="utf-8" media="print" />
	<script type="text/javascript" src="../jquerytaskflowchart/js/ExternalLibHandler.js"></script>
	<script type="text/javascript" src="../jquerytaskflowchart/js/TaskFlowChart.js"></script>

	<!-- DIAGRAM - Add ContextMenu main JS and CSS files -->
	<link rel="stylesheet" href="../jquerytaskflowchart/lib/jquerymycontextmenu/css/style.css" type="text/css" charset="utf-8" />
	<script language="javascript" type="text/javascript" src="../jquerytaskflowchart/lib/jquerymycontextmenu/js/jquery.mycontextmenu.js"></script>

	<!-- DIAGRAM - Parse_Str -->
	<script type="text/javascript" src="../jquerytaskflowchart/lib/phpjs/functions/strings/parse_str.js"></script>

	<!-- DIAGRAM - Add DropDowns main JS and CSS files -->
	<link rel="stylesheet" href="../jquerytaskflowchart/lib/jquerysimpledropdowns/css/style.css" type="text/css" charset="utf-8" />
	<!--[if lte IE 7]>
		     <link rel="stylesheet" href="../jquerytaskflowchart/lib/jquerysimpledropdowns/css/ie.css" type="text/css" charset="utf-8" />
	<![endif]-->
	<script language="javascript" type="text/javascript" src="../jquerytaskflowchart/lib/jquerysimpledropdowns/js/jquery.dropdownPlain.js"></script>
	
	<!-- DIAGRAM - Add Menus JS file -->
	<script language="javascript" type="text/javascript" src="../jquerytaskflowchart/js/menu.js"></script>
	
	<!-- DIAGRAM - Add TASKS JS and CSS files -->
	<?php echo printTasksCSSAndJS($tasks_settings, $webroot_cache_folder_path, $webroot_cache_folder_url); ?>
	
	<!-- CODE -->
	<!-- CODE - Add ACE-Editor -->
	<script type="text/javascript" src="../vendor/acecodeeditor/src-min-noconflict/ace.js"></script>
	<script type="text/javascript" src="../vendor/acecodeeditor/src-min-noconflict/ext-language_tools.js"></script>
	
	<!-- CODE - Message -->
	<link rel="stylesheet" href="../vendor/jquerymystatusmessage/css/style.css" type="text/css" charset="utf-8" />
	<script language="javascript" type="text/javascript" src="../vendor/jquerymystatusmessage/js/statusmessage.js"></script>
	
	<!-- CODE - (optional) Add Code Beautifier -->
	<script language="javascript" type="text/javascript" src="../vendor/myhtmlbeautify/vendor/mycodebeautifier/js/MyCodeBeautifier.js"></script>

	<!-- CODE - (optional) Add Html/CSS/JS Beautify code -->
	<script language="javascript" type="text/javascript" src="../vendor/myhtmlbeautify/vendor/jsbeautify/js/lib/beautify.js"></script>
	<script language="javascript" type="text/javascript" src="../vendor/myhtmlbeautify/vendor/jsbeautify/js/lib/beautify-css.js"></script>
	
	<!-- CODE - Add MyHtmlBeautify code -->
	<script language="javascript" type="text/javascript" src="../vendor/myhtmlbeautify/MyHtmlBeautify.js"></script>
	
	<!-- LOCAL -->
	<link rel="stylesheet" type="text/css" href="css/bloxtor_layout.css" />
	<link rel="stylesheet" type="text/css" href="css/style.css" />
	<script type="text/javascript" src="js/script.js"></script>
	
	<script>
		var diagram_to_code_url = "server/create_code_from_workflow_file.php?extension=<?php echo $extension; ?>&path=<?php echo $path; ?>_tmp";
		var code_to_diagram_url = "server/create_workflow_file_from_code.php?extension=<?php echo $extension; ?>&path=<?php echo $path; ?>_tmp";
		var get_tasks_file_url = "server/get_workflow_file.php?extension=<?php echo $extension; ?>&path=<?php echo $path; ?>";
		var set_tasks_file_url = "server/set_workflow_file.php?extension=<?php echo $extension; ?>&path=<?php echo $path; ?>";
		var set_tmp_tasks_file_url = set_tasks_file_url + "_tmp";
		var get_tmp_tasks_file_url = get_tasks_file_url + "_tmp";
		var set_code_file_url = "server/set_code_file.php?path=<?php echo $path; ?>";
		var get_code_file_url = "server/get_code_file.php?path=<?php echo $path; ?>";
		
		taskFlowChartObj.getMyFancyPopupObj().init({
			parentElement: window,
		});
		taskFlowChartObj.getMyFancyPopupObj().showOverlay();
		taskFlowChartObj.getMyFancyPopupObj().showLoading();
		
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
			
			taskFlowChartObj.TaskFile.save_options = {
				success: function(data, textStatus, jqXHR) {
					console.log("add some code after saving");
				}
			};
			
			taskFlowChartObj.TaskFile.on_success_read = function(data, text_status, jqXHR) {
				setTimeout(function() { //must be in timeout otherwise the connections will appear weird
					taskFlowChartObj.TaskFlow.repaintAllTasks();
					
					taskFlowChartObj.getMyFancyPopupObj().hidePopup();
				}, 5);
			};
			
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
					<li class="" title="File">
						<a>File</a>
						<ul>
							<li class="" title="Save">
								<a onClick="saveCode();return false;">Save</a>
							</li>
							<li class="" title="Pretty Print Code">
								<a onClick="prettyPrintCode();return false;">Pretty Print Code</a>
							</li>
							<li class="" title="Open Editor Setings">
								<a onClick="openEditorSettings();return false;">Open Editor Setings</a>
							</li>
							<li class="" title="Set Word Wrap">
								<a onClick="setWordWrap(this);return false;">Set Word Wrap</a>
							</li>
						</ul>
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
						<li class="" title="File">
							<a>File</a>
							<ul>
								<li class="" title="Save">
									<a onClick="taskFlowChartObj.TaskFile.save();return false;">Save</a>
								</li>
								<li class="" title="Empty Diagram">
									<a onClick="emptyDiagam();return false;">Empty Diagram</a>
								</li>
								<li class="" title="Flip Diagram">
									<a onClick="taskFlowChartObj.ContextMenu.flipPanelsSide();return false;">Flip Diagram</a>
								</li>
							</ul>
						</li>
						<li class="" title="Zoom">
							<a><i class="icon search"></i> Zoom</a>
							<ul>
								<li class="" title="Zoom In">
									<a onClick="zoomInDiagram(this);return false;">Zoom In</a>
								</li>
								<li class="" title="Zoom Out">
									<a onClick="zoomOutDiagram(this);return false;">Zoom Out</a>
								</li>
								<li class="zoom" title="Zoom">
									<span>100%</span> 
									<input type="range" min="0.5" max="1.5" step=".02" value="1" onInput="zoomDiagram(this);return false;" />
								</li>
								<li class="" title="Zoom Reset">
									<a onClick="zoomResetDiagram(this);return false;">Zoom Reset</a>
								</li>
							</ul>
						</li>
						<li class="sort_tasks" title="Sort Tasks">
							<a onclick="sortWorkflowTask();return false;"><i class="icon sort"></i> Sort Tasks</a>
							<ul style="visibility: hidden;">
								<li class="sort_tasks" title="Sort Type 1"><a onclick="sortWorkflowTask(1);return false;">Sort Type 1</a></li>
								<li class="sort_tasks" title="Sort Type 2"><a onclick="sortWorkflowTask(2);return false;">Sort Type 2</a></li>
								<li class="sort_tasks" title="Sort Type 3"><a onclick="sortWorkflowTask(3);return false;">Sort Type 3</a></li>
								<li class="sort_tasks" title="Sort Type 4"><a onclick="sortWorkflowTask(4);return false;">Sort Type 4</a></li>
							</ul>
						</li>
						<li class="" title="Repaint Diagram">
							<a onClick="repaintAllTasks();return false;"><i class="icon palette"></i> Repaint Diagram</a>
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
