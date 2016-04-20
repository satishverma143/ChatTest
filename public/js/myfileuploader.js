$(document).ready(function () {    
    var manualuploader = new qq.FineUploader({
        element: $('#bootstrapped-fine-uploader')[0],
        request: {
            endpoint: 'uploads'
        },
        autoUpload: false,
        text: {
            uploadButton: '<i class="icon-plus icon-white"></i> Select Files'
        },
        debug: true
    });
    
    $('#btnsubmitchat').click(function () {
        manualuploader.uploadStoredFiles();
    });
});
//function createUploader() {
//    var uploader = new qq.FineUploader({
//        element: document.getElementById('bootstrapped-fine-uploader'),
//        request: {
//            endpoint: '../uploads'
//        },
//        text: {
//            uploadButton: '<i class="icon-upload icon-white"></i> Test me now and upload a file'
//        },
//        template: '<div class="qq-uploader span12">' +
//                      '<pre class="qq-upload-drop-area span12"><span>{dragZoneText}</span></pre>' +
//                      '<div class="qq-upload-button btn btn-success" style="width: auto;">{uploadButtonText}</div>' +
//                      '<ul class="qq-upload-list" style="margin-top: 10px; text-align: center;"></ul>' +
//                    '</div>',
//        classes: {
//            success: 'alert alert-success',
//            fail: 'alert alert-error'
//        },
//        debug: true
//    });
//}

//window.onload = createUploader;