<?php
header("Access-Control-Allow-Origin: *");

@error_reporting ( E_ALL ^ E_WARNING ^ E_NOTICE );
@ini_set ( 'display_errors', true );
@ini_set ( 'html_errors', false );
@ini_set ( 'error_reporting', E_ALL ^ E_WARNING ^ E_NOTICE );

$name = htmlspecialchars($_REQUEST['name'], ENT_QUOTES);
$phone = htmlspecialchars($_REQUEST['phone'], ENT_QUOTES);
$email = htmlspecialchars($_REQUEST['email'], ENT_QUOTES);
$city = htmlspecialchars($_REQUEST['city'], ENT_QUOTES);

$tomail = 'kovarnyi@gmail.com';
if ($phone == '') {$errors = 1;}
if (!$errors) {

  $to = $tomail;

  $header  = 'MIME-Version: 1.0'."\r\n";
  $header .= 'Content-type: text/html; charset=utf-8'."\r\n";
  $header .= 'From: Rul / <no-reply@rul-fr.ru>'."\r\n";
  $header .= 'Subject: РУЛЬ: Заявка на франшизу ['.$name.']';

  $subject = 'РУЛЬ: Заявка на франшизу от ['.$name.']';

  $msg = '<html>'."\n";
  $msg .= '    <head>'."\n";
  $msg .= '        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'."\n";
  $msg .= '    </head>'."\n";
  $msg .= '    <body>'."\n";
  $msg .= '    <h2>Заявка на франшизу РУЛЬ</h2>'."\n";
  $msg .= '    <table cellpadding="5" cellspacing="0">'."\n";
  $msg .= '        <tr><td><strong>Город:</strong></td><td>'.$city.'</td></tr>'."\n";
  $msg .= '        <tr><td><strong>Имя:</strong></td><td>'.$name.'</td></tr>'."\n";
  $msg .= '        <tr><td><strong>E-mail:</strong></td><td>'.$email.'</td></tr>'."\n";
  $msg .= '        <tr><td><strong>Телефон:</strong></td><td>'.$phone.'</td></tr>'."\n";
  $msg .= '    </table>'."\n";
  $msg .= '    </body>'."\n";
  $msg .= '</html>'."\n";

  if (mail($to, $subject, $msg, $header)) {
    $output = '<p class="alert alert-success text-center gr"><strong>Ваша заявка принята!</strong><br>На Вашу почту отправлено коммерческое предложение.<br /> Проверьте папку СПАМ, если в течении 5-ти минут письмо не пришло. </p>';
  } else {
    $output = '<p>Произошла ошибка, пожалуйста повторите попытку позже.</p>';
  }
}
print $output;

//Массив менеджеров
// 959728 - Макс
// 647493 - Волосатов
// 2185033 - Мария
// 2168830 - Дмитрий (Удаленный)

// $manager = array(647493, 959728, 2185033);
// $select_manager = $manager[rand(0, 3)];

if (!$errors) {
/*
  $user=array(
    'USER_LOGIN'=>'fr@sol-plus.ru', #Ваш логин (электронная почта)
    'USER_HASH'=>'b619850b32404de2a60436f415b30a5a' #Хэш для доступа к API (смотрите в профиле пользователя)
  );

  $subdomain='solplus'; #Наш аккаунт - поддомен
  $link='https://'.$subdomain.'.amocrm.ru/private/api/auth.php?type=json';

  $curl=curl_init(); #Сохраняем дескриптор сеанса cURL
  curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
  curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-API-client/1.0');
  curl_setopt($curl,CURLOPT_URL,$link);
  curl_setopt($curl,CURLOPT_CUSTOMREQUEST,'POST');
  curl_setopt($curl,CURLOPT_POSTFIELDS,json_encode($user));
  curl_setopt($curl,CURLOPT_HTTPHEADER,array('Content-Type: application/json'));
  curl_setopt($curl,CURLOPT_HEADER,false);
  curl_setopt($curl,CURLOPT_COOKIEFILE,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
  curl_setopt($curl,CURLOPT_COOKIEJAR,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
  curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
  curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);
  $out=curl_exec($curl); #Инициируем запрос к API и сохраняем ответ в переменную
  $code=curl_getinfo($curl,CURLINFO_HTTP_CODE); #Получим HTTP-код ответа сервера
  curl_close($curl); #Завершаем сеанс cURL
  /* Теперь мы можем обработать ответ, полученный от сервера. Это пример. Вы можете обработать данные своим способом. * /
  $code=(int)$code;
  $errors=array(
    301=>'Moved permanently',
    400=>'Bad request',
    401=>'Unauthorized',
    403=>'Forbidden',
    404=>'Not found',
    500=>'Internal server error',
    502=>'Bad gateway',
    503=>'Service unavailable'
  );
  try
  {
    #Если код ответа не равен 200 или 204 - возвращаем сообщение об ошибке
    if($code!=200 && $code!=204)
      throw new Exception(isset($errors[$code]) ? $errors[$code] : 'Undescribed error',$code);
  }
  catch(Exception $E)
  {
    die('Ошибка: '.$E->getMessage().PHP_EOL.'Код ошибки: '.$E->getCode());
  }
  /*
   Данные получаем в формате JSON, поэтому, для получения читаемых данных,
   нам придётся перевести ответ в формат, понятный PHP
   * /
  $Response=json_decode($out,true);
  $Response=$Response['response'];
  if(isset($Response['auth'])){


//Создание контакта

    $contacts['add']=array(
      array(
        'name' => $name,
        'responsible_user_id' => $select_manager,
        'created_by' => Time(),
        'created_at' =>  Time(),
        'custom_fields' => array(
          array(
            'id' => 768412,
            'values' => array(
              array(
                'value' => $phone,
                'enum' => "MOB"
              )
            )
          ),
          array(
            'id' => 768414,
            'values' => array(
              array(
                'value' => $email,
                'enum' => "WORK"
              )
            )
          )
        )
      )
    );


    #Формируем ссылку для запроса
    $link='https://'.$subdomain.'.amocrm.ru/api/v2/contacts';
    $curl=curl_init(); #Сохраняем дескриптор сеанса cURL
    curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
    curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-API-client/1.0');
    curl_setopt($curl,CURLOPT_URL,$link);
    curl_setopt($curl,CURLOPT_CUSTOMREQUEST,'POST');
    curl_setopt($curl,CURLOPT_POSTFIELDS,json_encode($contacts));
    curl_setopt($curl,CURLOPT_HTTPHEADER,array('Content-Type: application/json'));
    curl_setopt($curl,CURLOPT_HEADER,false);
    curl_setopt($curl,CURLOPT_COOKIEFILE,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
    curl_setopt($curl,CURLOPT_COOKIEJAR,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
    curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
    curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);
    $out=curl_exec($curl); #Инициируем запрос к API и сохраняем ответ в переменную
    $code=curl_getinfo($curl,CURLINFO_HTTP_CODE);
    $code=(int)$code;
    $errors=array(
      301=>'Moved permanently',
      400=>'Bad request',
      401=>'Unauthorized',
      403=>'Forbidden',
      404=>'Not found',
      500=>'Internal server error',
      502=>'Bad gateway',
      503=>'Service unavailable'
    );
    try
    {
      #Если код ответа не равен 200 или 204 - возвращаем сообщение об ошибке
      if($code!=200 && $code!=204) {
        throw new Exception(isset($errors[$code]) ? $errors[$code] : 'Undescribed error',$code);
      }
    }
    catch(Exception $E)
    {
      die('Ошибка: '.$E->getMessage().PHP_EOL.'Код ошибки: '.$E->getCode());
    }
    $Response=json_decode($out,true);
    $contact_id = $Response['_embedded']['items'][0]['id'];





    $leads['add']=array(
      array(
        'name'=>$name.' '.$city,
        'created_at'=>Time(),
        'responsible_user_id'=>$select_manager,
        'status_id'=>9879327,
        'contacts_id'=>$contact_id,
        'custom_fields'=>array(
          array(
            'id'=>933271,
            'values'=>$city
          ),
          array(
            'id'=>933257,
            'values'=>$name
          )

        )
      )
    );


    $link='https://'.$subdomain.'.amocrm.ru/api/v2/leads';
    $curl=curl_init(); #Сохраняем дескриптор сеанса cURL
    curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
    curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-API-client/1.0');
    curl_setopt($curl,CURLOPT_URL,$link);
    curl_setopt($curl,CURLOPT_CUSTOMREQUEST,'POST');
    curl_setopt($curl,CURLOPT_POSTFIELDS,json_encode($leads));
    curl_setopt($curl,CURLOPT_HTTPHEADER,array('Content-Type: application/json'));
    curl_setopt($curl,CURLOPT_HEADER,false);
    curl_setopt($curl,CURLOPT_COOKIEFILE,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
    curl_setopt($curl,CURLOPT_COOKIEJAR,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
    curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
    curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);
    $out=curl_exec($curl); #Инициируем запрос к API и сохраняем ответ в переменную
    $code=curl_getinfo($curl,CURLINFO_HTTP_CODE);
    /* Теперь мы можем обработать ответ, полученный от сервера. Это пример. Вы можете обработать данные своим способом. * /
    $code=(int)$code;
    $errors=array(
      301=>'Moved permanently',
      400=>'Bad request',
      401=>'Unauthorized',
      403=>'Forbidden',
      404=>'Not found',
      500=>'Internal server error',
      502=>'Bad gateway',
      503=>'Service unavailable'
    );
    try
    {
      #Если код ответа не равен 200 или 204 - возвращаем сообщение об ошибке
      if($code!=200 && $code!=204) {
        echo 'не удалось создать заявку!';
      }else{
        $Response=json_decode($out,true);
        $lead_id = $Response['_embedded']['items'][0]['id'];
      }
    }
    catch(Exception $E)
    {
      die('Ошибка: '.$E->getMessage().PHP_EOL.'Код ошибки: '.$E->getCode());
    }


  }

*/

  //------

  $toFr = $email;
  $headerFr = 'MIME-Version: 1.0' . "\r\n";
  $headerFr .= 'Content-type: text/html; charset=utf-8' . "\r\n";
  $headerFr .= 'From: Руль / <info@rul-fr.ru>' . "\r\n";
  $headerFr .= 'Subject: РУЛЬ: Подробное предложение по франшизе';
  $subjectFr = 'РУЛЬ: Подробное предложение по франшизе';

  $msgFr = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns:v="urn:schemas-microsoft-com:vml">
<head>

	<!-- Define Charset -->
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>

	<!-- Responsive Meta Tag -->
	<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">

	<link href=\'https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700\' rel=\'stylesheet\' type=\'text/css\'>
	<link href=\'http://fonts.googleapis.com/css?family=Montserrat:400,500,300,600,700\' rel=\'stylesheet\' type=\'text/css\'>

	<title>Email</title>

	<style type="text/css">

		body {
			width: 100%;
			background-color: #ffffff;
			margin: 0;
			padding: 0;
			-webkit-font-smoothing: antialiased;
			mso-margin-top-alt: 0px;
			mso-margin-bottom-alt: 0px;
			mso-padding-alt: 0px 0px 0px 0px;
		}

		p, h1, h2, h3, h4 {
			margin-top: 0;
			margin-bottom: 0;
			padding-top: 0;
			padding-bottom: 0;
		}

		span.preheader {
			display: none;
			font-size: 1px;
		}
		table.sravnenie{
			border: 1px solid #ddd;
		}
		table.sravnenie thead tr td,
		table.sravnenie tbody tr td{
			border: 1px solid #ddd;
			padding: 5px;
		}

		html {
			width: 100%;
		}

		table {
			font-size: 14px;
			border: 0;
		}
		ul{
			-webkit-padding-start: 15px;
		}

		/* ----------- responsivity ----------- */
		@media only screen and (max-width: 798px) {
			body[yahoo] .hide-800 {
				display: none !important;
			}

			body[yahoo] .container800 {
				width: 100% !important;
			}

			body[yahoo] .container800_img {
				width: 50% !important;
			}

			body[yahoo] .section800_img img {
				width: 100% !important;
				height: auto !important;
			}

			body[yahoo] .half-container800 {
				width: 49% !important;
			}
		}

		/* ----------- responsivity ----------- */
		@media only screen and (max-width: 640px) {

			/*------ top header ------ */
			body[yahoo] .main-header {
				font-size: 20px !important;
			}

			body[yahoo] .main-section-header {
				font-size: 26px !important;
			}

			body[yahoo] .show {
				display: block !important;
			}

			body[yahoo] .hide {
				display: none !important;
			}

			body[yahoo] .align-center {
				text-align: center !important;
			}

			body[yahoo] .no-border {
				border-right: none !important;
			}

			/*-------- container --------*/
			body[yahoo] .container590 {
				width: 440px !important;
			}

			body[yahoo] .container580 {
				width: 400px !important;
			}

			body[yahoo] .blog-container590 {
				width: 320px !important;
			}

			body[yahoo] .blog-container580 {
				width: 300px !important;
			}

			body[yahoo] .container800 {
				width: 440px !important;
			}

			body[yahoo] .container800_img {
				width: 100% !important;
			}

			body[yahoo] .section800_img img {
				width: 100% !important;
			}

			body[yahoo] .half-container {
				width: 220px !important;
			}

			body[yahoo] .main-button {
				width: 220px !important;
			}

			body[yahoo] .timeline {
				background: none !important;
			}

			/* ====== divider ====== */
			body[yahoo] .divider img {
				width: 440px !important;
			}

			/*-------- secions ----------*/
			body[yahoo] .section-img img {
				width: 320px !important;
				height: auto !important;
			}

		}

		@media only screen and (max-width: 479px) {
			/*------ top header ------ */
			body[yahoo] .main-header {
				font-size: 18px !important;
			}

			body[yahoo] .main-section-header {
				font-size: 24px !important;
			}

			/*-------- container --------*/
			body[yahoo] .container590 {
				width: 280px !important;
			}

			body[yahoo] .container580 {
				width: 260px !important;
			}

			body[yahoo] .blog-container590 {
				width: 280px !important;
			}

			body[yahoo] .blog-container580 {
				width: 260px !important;
			}

			body[yahoo] .container800 {
				width: 100% !important;
			}

			body[yahoo] .container800_img {
				width: 100% !important;
			}

			body[yahoo] .section800_img img {
				width: 100% !important;
				height: auto !important;
			}

			body[yahoo] .half-container800 {
				width: 100% !important;
			}

			body[yahoo] .half-container {
				width: 130px !important;
			}

			/* ====== divider ====== */
			body[yahoo] .divider img {
				width: 280px !important;
			}

			/*-------- secions ----------*/
			body[yahoo] .section-img img {
				width: 280px !important;
				height: auto !important;
			}
		}

	</style>
</head>


<body yahoo="fix" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">


<!-- ШАПКА -->
<table mc:repeatable="this" mc:variant="mainsection" border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff" height="400">

	<tbody>
	<tr>
		<td class="change_bg" align="center">
			<img src="http://rul-fr.ru/formail/bg.jpg" alt="" width="600" height="357"/>

		</td>
	</tr>

	</tbody>
</table>
<!-- ШАПКА всё -->

<!-- ПРИВЕТ -->
<table border="0" width="100%" align="center" bgcolor="ffffff" cellpadding="0" cellspacing="0" class="wrap590">

	<tbody>



	<tr>
		<td mc:edit="features_subtitle" align="center"
		    style="color: #313131; font-size: 30px; font-family: \'Roboto Slab\', sans-serif; line-height: 24px; font-weight:00;"
		    class="title_color title-two">
			<!-- ======= section text ====== -->

			<div class="edit_text" style="line-height: 10px">

				<multiline><br>Добрый день, ' . $name . '</multiline>

			</div>
		</td>
	</tr>

	<tr>
		<td height="15" style="font-size: 15px; line-height: 15px;">&nbsp;</td>
	</tr>


	</tbody>
</table>
<table border="0" width="100%" align="center" bgcolor="ffffff" cellpadding="0" cellspacing="0" class="wrap590">
	<tbody>
	<tr>
		<td>
			<table border="0" width="590" align="center" bgcolor="ffffff" cellpadding="0" cellspacing="0"
			       class="wrap590">
				<tbody>
				<tr>
					<td height="15" style="font-size: 15px; line-height: 15px;">&nbsp;</td>
				</tr>

				<tr>
					<td mc:edit="gallery_txt" align="center"
					    style="color: #777777; font-size: 14px; font-family: \'Open Sans\', sans-serif; line-height: 24px;">
						<!-- ======= section text ====== -->

						<div class="edit_text" style="line-height: 24px">
							<multiline>
								Скачайте полное коммерческое предложение по ссылке
									<br> или сразу свяжитесь с нашим отделом продаж<br>
							</multiline>
						</div>
					</td>
				</tr>

				<tr>
					<td height="15" style="font-size: 15px; line-height: 15px;">&nbsp;</td>
				</tr>

				</tbody>
			</table>
			<table border="0" align="center" width="320" cellpadding="0"
			       cellspacing="0" class="main-button" bgcolor="ffe200">

				<tbody>
				<tr>
					<td height="10" style="font-size: 10px; line-height: 10px;">
						&nbsp;</td>
				</tr>

				<tr>
					<td kb:edit="button1" mc:edit="main_button" align="center"
					    style="color: #ffffff; font-size: 13px; font-family: \'Lato\', sans-serif; font-weight: 400; line-height: 26px;">
						<!-- ======= main section button ======= -->

						<div class="edit_text" style="line-height: 26px;">
							<multiline class="button"><a href="https://yadi.sk/i/yrYw75Zj3W7zDh" download
							                             style="color: #000000; text-decoration: none; font-weight: bold;">СКАЧАТЬ КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ</a></multiline>
						</div>
					</td>
				</tr>

				<tr>
					<td height="10" style="font-size: 10px; line-height: 10px;">
						&nbsp;</td>
				</tr>

				</tbody>
			</table>
			<table border="0" align="center" width="320" cellpadding="0"
			       cellspacing="0">

				<tbody>
				<tr>
					<td height="10" style="font-size: 10px; line-height: 10px;">
						&nbsp;</td>
				</tr>
				</tbody>
			</table>
			<table border="0" align="center" width="320" cellpadding="0"
			       cellspacing="0" class="main-button" bgcolor="CCCCCC">

				<tbody>
				<tr>
					<td height="10" style="font-size: 10px; line-height: 10px;">
						&nbsp;</td>
				</tr>

				<tr>
					<td kb:edit="button1" mc:edit="main_button" align="center"
					    style="color: #ffffff; font-size: 13px; font-family: \'Lato\', sans-serif; font-weight: 400; line-height: 26px;">
						<!-- ======= main section button ======= --> 

						<div class="edit_text" style="line-height: 26px;">
							<multiline class="button"><a href="http://rul-fr.ru/unisender-mail.php?name='. $name .'&mail='. $email .'&city='. $city .'&phone='. $phone .'&whatbutton=Подробная_консультация&lead_id='.$lead_id.'"
							                             style="color: #ffffff; text-decoration: none;">СВЯЗАТЬСЯ С ОТДЕЛОМ ПРОДАЖ</a></multiline>
						</div>
					</td>
				</tr>

				<tr>
					<td height="10" style="font-size: 10px; line-height: 10px;">
						&nbsp;</td>
				</tr>

				</tbody>
			</table>
			<table border="0" align="center" width="320" cellpadding="0"
			       cellspacing="0">

				<tbody>
				<tr>
					<td height="10" style="font-size: 10px; line-height: 10px;">
						&nbsp;</td>
				</tr>
				</tbody>
			</table>

			<table border="0" width="590" align="center" bgcolor="ffffff" cellpadding="0" cellspacing="0"
			       class="wrap590">
				<tbody>



				<tr>
					<td mc:edit="gallery_txt" align="center"
					    style="color: #777777; font-size: 14px; font-family: \'Open Sans\', sans-serif; line-height: 24px;">
						<!-- ======= section text ====== -->

						<div class="edit_text" style="line-height: 24px">
							<multiline>
								<br>
								<br>
								['.date('G:i:s  d/m/o',time()).']
							</multiline>
						</div>
					</td>
				</tr>

				<tr>
					<td height="15" style="font-size: 15px; line-height: 15px;">&nbsp;</td>
				</tr>

				</tbody>
			</table>

			<table border="0" align="center" width="320" cellpadding="0"
			       cellspacing="0">

				<tbody>
				<tr>
					<td height="10" style="font-size: 10px; line-height: 10px;">
						&nbsp;</td>
				</tr>
				</tbody>
			</table>
		</td>
	</tr>
	
	</tbody>
</table>
<!-- ПРИВЕТ всё -->



</body>
</html>' . "\n";


  if (mail ($toFr, $subjectFr, $msgFr, $headerFr)) {
    $output .= '<p class="alert alert-success text-center gr"><strong>Ваша заявка принята!</strong><br>Ожидайте звонка специалиста.</p>';

  } else {
    $output = '<p>Произошла ошибка, пожалуйста повторите попытку позже '. $name .' .</p>';

  }


}
?>


