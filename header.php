<?php
session_start();
?>
<!DOCTYPE HTML>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/>
	<title>
		TypeWords
	</title>
	<!-- js库 -->
	<script src="/type-words/js/jquery-3.6.0.min.js"></script>
    <script src="/type-words/js/preloadjs.min.js"></script>
    <script src="/type-words/js/soundjs.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js"></script>
	<script src="/type-words/js/all.js"></script>
	<!-- 加载主题CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css">
	<link rel="stylesheet" href="/type-words/css/style.css" type="text/css" media="screen"/>
    <link rel="stylesheet" href="/type-words/css/all.css" type="text/css" media="screen"/>
	<!-- 加载主题js -->
	<script src="/type-words/js/functions.js"></script>
    <script>
        window.onload = function () {
            screen_height = document.documentElement.clientHeight;
            screen_width = document.documentElement.clientWidth;
            init();
        }
    </script>
</head>
<body>
