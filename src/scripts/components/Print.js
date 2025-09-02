$(() => {
    $(document).ready(function() {
        $('#printBtn').on('click', function () {
            const content = $('.cont-area').html();
            const printWindow = window.open('', '', 'width=1280,height=1000');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print</title>                    
                        <link rel="stylesheet" href="../css/common.css">
                        <link rel="stylesheet" href="../css/components.css">
                        <link rel="stylesheet" href="../css/layouts.css">
                        <link rel="stylesheet" href="../css/pages.css">
                    </head>
                    <body>${content}</body>
                </html>
            `);                        
            
            setTimeout(function(){
                printWindow.print();
                printWindow.close();
            },300)            
        });
    });
});