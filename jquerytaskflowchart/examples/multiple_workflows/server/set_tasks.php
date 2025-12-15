<?php
$chart = @$_GET["chart"];
$chart = $chart ? $chart : 1;

$save = @$_POST["save"];
$data = @$_POST["data"];
$file_read_date = @$_POST["file_read_date"];

$fp = __DIR__ . "/saved_test_tasks_chart_" . $chart . ".json";

if ($save) {
	$content = json_encode($data);
	$status = file_put_contents($fp, $content) !== false;
	
	echo $status;
}
?>
