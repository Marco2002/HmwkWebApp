// =====================
// Materialize code
// =====================

$(function() {
    
    // get homework or exam page
    var url = window.location.pathname;
    // file collection index
    var fileIndex = 0;
    
    $('ul.tabs').tabs(
        'select_tab', url.substring(url.lastIndexOf('/') + 1), {
            swipeable : true
        }
    );
    
    // Initialize collapse button
    $('.button-collapse').sideNav({
          menuWidth: 300, // Default is 300
          closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
          draggable: true, // Choose whether you can drag to open on touch screens,
          onOpen: function(el) { /* Do Stuff */ }, // A function to be called when sideNav is opened
          onClose: function(el) { /* Do Stuff */ }, // A function to be called when sideNav is closed
        }
    );
    
    // datepicker for homework/new form setup
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false, // Close upon selecting a date,
        format: 'dd.mm.yyyy',
        min: new Date(),
    });
    
    // subject selection setup
    $(document).ready(function() {
        $('select').material_select();
    });
    
    // Form Configuration
    $('#btn-submit').click(function() {
        
        function formConfigTitle() {
            var x = $('#homeworkTitle').val();
            if (x == '') { 
                Materialize.toast('Please enter the title!', 4000);
            } else if( x.length > 40 ) {
                Materialize.toast('Title cant be longer than 40 characters!', 4000);
            } else {
                return true;
            }
        }
        
        function formConfigDate() {
            var x = $('#homeworkDate').val();
            if(x == '') { 
                Materialize.toast('Please enter the deadline!', 4000);
            } else {
                return true;
            }
        }
        
        function formConfigDes() {
            if(!document.getElementById('homeworkDescription')) {
                return true;
            }
            
            var x = $('#homeworkDescription').val();
            if (x == '') { 
                Materialize.toast('Please enter a description!', 4000);
            } else if( x.length > 500) {
                Materialize.toast('Description cant be longer than 300 characters!', 4000);
            } else {
                return true;
            }
        }
        
        function formConfigSubject() {
            var x = $('#homeworkSubject').val();
            if (x == undefined) { 
                Materialize.toast('Please enter a subject!', 4000);
            } else {
                return true;
            }
        }
    
        if(formConfigTitle() && formConfigDate() && formConfigDes() && formConfigSubject() == true) {
            $('.hide').remove();
            $('#form').submit();
        }
    });

    // add topic or subject container
    $('#btnAddContainer').click(function() {
        
        $('.hide').first().removeClass('hide');
    });
    
    // remove topic or subject container
    $('#btnRemoveContainer').click(function() {
        $('#container:not(.hide)').last().addClass('hide');
    });
    
    // Close Alert
    $('.alert').on('click', '#alert-close', function() {
        $('.alert').fadeOut('slow', function() {});
    });
    
    // Warning before delete. the 'href' attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
    });
    
    // language submit button
    $('#lang_submit').click(function() {
        var lang = $('#selectedLang option:selected').val();
        
        window.location.replace(url + '?clang=' + lang);
    });
    
    // theme submit button
    $('#theme_submit').click(function() {
        var theme = $('input:radio[name="theme"]:checked').val();
        
        window.location.replace(url + '?theme=' + theme);
    });
    
    // Redirect to add homework or add exam page (float btn)
    $('#redirectToAddPage').click(function() {
        // read class_id from url
        var class_id = window.location.pathname.split('/')[2];
        if($('#tabHomework').hasClass('active')) {
            // homework tab is active => redirect to add homework
            window.location = '/classes/' + class_id + '/homework/new';
        } else {
            // exams tab is active => redirect to add exam
            window.location = '/classes/' + class_id + '/exams/new';
        }
    });
    
    // select subject on click on card
    $('.subject-card').click(function() {
        var checkBox = $(this).find('input');
        checkBox.prop('checked', !checkBox.prop('checked'));
    });
    
    // prevent form from submitting multiple times
    $('body').on('submit', 'form', function() {
        $(this).submit(function() {
            return false;
        });
        return true;
    });
    
    console.log('script.js file active');
    
    return this;
});
