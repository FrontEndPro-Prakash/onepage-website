/*contact form*/
var is_form_valid=false;
function getRecaptcha() {
		grecaptcha.execute(gCaptchKey, { action: 'contact' }).then(function (token) {
                var recaptchaResponse = document.getElementById('recaptchaResponse');
                recaptchaResponse.value = token;
        });
}
$('form').submit(function(event) {
	event.preventDefault();
	if(!is_form_valid){
		var validation;
		var is_validation=1;
		var validation_key;
		var current_value;
		var value_input = $(this).find("input[data-validation]");

		value_input.each(function(){

			current_element = $(this);
			validation = $(this).attr('data-validation');
			validation_key = validation.split(' ');
			current_value = $(this).val();
			current_element.parent().find('.error').text('');
			$(validation_key).each(function(index,value){
				if(value=='required'){
					if(current_value  == '')  {
						current_element.parent().find('.error').text("This is required field");
						is_validation=0;
					}
				}
				if(value=='email'){
					if(!IsEmail(current_value) && current_element.parent().find('.error').text()=='')  {
						current_element.parent().find('.error').text("Please enter a valid e-mail");
						is_validation=0;
					}
				}

				if(value=='number'){
					if(!phone_validate(current_value) && current_element.parent().find('.error').text()=='')  {
						current_element.parent().find('.error').text("Please enter a valid number");
						is_validation=0;
					}else if(current_value.length < 10  && current_element.parent().find('.error').text()=='')  {

						current_element.parent().find('.error').text("Please enter minimum 10 numbers");
						is_validation=0;
					}

				}
			});

		});

		if(is_validation==1) {
			is_form_valid = true;
			$('form').find("button[type='submit']").prop('disabled',true);
			$('#submit-btn').html('Sending... <img class="ccf-item-loader loader" src="assets/img/contact-loader.svg">');
			$.ajax({
                    url:'send1.php',
                    type:'POST',
                    data:$(this).serialize(),
                    success:function(result){
                    	console.log(result);
                    	if(result.success==true){
                    		$('#form-response-msg').removeClass('text-danger');
							$('#form-response-msg').addClass('text-success');
                    	}else{
                    		$('#form-response-msg').removeClass('text-success');
                    		$('#form-response-msg').addClass('text-danger');
                    	}
                    	$('#form-response-msg').text(result.msg);
                    	$('form')[0].reset();
                    },
                    error:function(){
                    	$('#form-response-msg').text('An Unexpected error occurred, please try again.');
                    },
                    complete:function(){
                    	is_form_valid = false;
                    	is_validation = 0;
                    	$('#submit-btn').prop('disabled',false);
                    	$('#submit-btn').html('Send');
                    	getRecaptcha();
                    }

            });

			//$('form').submit();    

		}
	}
	return false;
});

function IsEmail(email) {
	var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(!regex.test(email)) {
		return false;
	}else{
		return true;
	}
}

function phone_validate(textphone) { 
	var regexPattern=new RegExp(/^[0-9-+]+$/);  
	return regexPattern.test(textphone); 
} 