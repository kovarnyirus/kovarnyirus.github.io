<?php
$name = htmlspecialchars ($_GET[ 'name' ], ENT_QUOTES);
$mail = htmlspecialchars ($_GET[ 'mail' ], ENT_QUOTES);
$city = htmlspecialchars ($_GET[ 'city' ], ENT_QUOTES);
$phone = htmlspecialchars ($_GET[ 'phone' ], ENT_QUOTES);


$tomail = 'info@bixels.ru, info@rul-fr.ru';

if (!$errors) {
	$to = $tomail;
	$header = 'MIME-Version: 1.0' . "\r\n";
	$header .= 'Content-type: text/html; charset=utf-8' . "\r\n";
	$header .= 'From: РУЛЬ / <info@rul-fr.ru>' . "\r\n";
	$header .= 'Subject: РУЛЬ: Заявка c письма [' . $name . ']';
	$subject = 'РУЛЬ: Заявка на запись [' . $name . ']';
	$msg = '<html>' . "\n";
	$msg .= '    <head>' . "\n";
	$msg .= '        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' . "\n";
	$msg .= '    </head>' . "\n";
	$msg .= '    <body>' . "\n";
	$msg .= '    <h2>Заявка c письма РУЛЬ КП</h2>' . "\n";
	$msg .= '    <table cellpadding="5" cellspacing="0">' . "\n";
	$msg .= '        <tr><td><strong>Имя:</strong></td><td>' . $name . '</td></tr>' . "\n";
	$msg .= '        <tr><td><strong>Телефон:</strong></td><td>' . $phone . '</td></tr>' . "\n";
	$msg .= '        <tr><td><strong>Почта:</strong></td><td>' . $mail . '</td></tr>' . "\n";
	$msg .= '        <tr><td><strong>Город:</strong></td><td>' . $city . '</td></tr>' . "\n";

	$msg .= '    </table>' . "\n";
	$msg .= '    </body>' . "\n";
	$msg .= '</html>' . "\n";
	if (mail ($to, $subject, $msg, $header)) {
	    
		$output .= '
            <!doctype html>
            <html lang="en">
            <head>
            	<meta charset="UTF-8">
            	<meta name="viewport" content="width=700, initial-scale=0.5">
            	<meta http-equiv="X-UA-Compatible" content="ie=edge">
            	<title>Спасибо | Франшиза РУЛЬ</title>
            </head>
            <body>
            <div style="width: 100%; text-align: center; font-family: Arial;    line-height: 23px; margin-top: 100px;">
            	<!-- <img src="http://sol-plus.ru/formail/logo-color.svg" alt="Соль+" style="padding-bottom: 50px; width: 185px"/> -->
            	<p>
            		<strong style=" color: #383838; font-size: 28px; line-height: 1.29; text-align: center;  font-weight: bold;">' . $name . ', спасибо, что уделили время на изучение<br> подбробного коммерческого предложения!</strong>
            		<br>
            		<br>
            		<span style="font-size: 19px; line-height: 1.53; color: #383838;">В ближайшее время с Вами свяжется Ваш персональный менеджер<br> и подробно ответит на все возникшие вопросы!</span> <br/>
            		<br/>
            	<hr style="width: 70%;">
            	<!-- <h1 style="color: #f00; font-size: 44px; line-height: 1.3; font-weight: bold;">Готовы подписать договор? Звоните!</h1> -->
            	<span style="font-size: 19px; line-height: 1.53;">
            	                               Если у вас есть намерение подписать договор сегодня <br/>
            	                               и имеются требуемые инвестиции, позвоните по специальному телефону. <br/>
            	                               Надеемся на плодотворное сутрудничество!<br/>
            	</span>
            	<br/>
            	<img src="http://rul-fr.ru/formail/phone.jpg" alt="" width="61" style="margin-bottom: -9px"/><a href="tel:+79058550505" style="padding-left: 10px; font-size: 58px; line-height: 1.52; color: #383838; text-decoration: none; "><b>+7 905 855-05-05</b></a>
            	</p>
            </div>
            </body>
            </html>
		';

	} else {
		$output = '<p>Произошла ошибка, пожалуйста повторите попытку позже ' . $name . ' .</p>';

	}
echo $output;
}

?>