<?php
$chart = @$_GET["chart"];
$chart = $chart ? $chart : 1;

$fp = __DIR__ . "/saved_test_tasks_chart_" . $chart . ".json";

if (file_exists($fp))
	echo file_get_contents($fp);
?>
