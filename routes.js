module.exports = function(app) {

    var http = require("https");

    var mysql = require('mysql');

    var resultCode;


    var con = mysql.createConnection({

        host: "ficodemo2.cegeld064h3q.us-west-2.rds.amazonaws.com",
        user: "root",
        password: "mypass321123P"
    });

    con.connect(function(err) {

	app.get('*', function(req, res) {
		res.sendfile('./index.html');
	});

        app.post("/startsession", function(req, res) {
            var r = req;
            var payload = req.body[0];
            var b = payload;
        });

	app.post("/customerinfo", function(req, res) {


        var options = {
            "method": "POST",
            "hostname": "bszkha48q3.execute-api.us-west-2.amazonaws.com",
            "port": null,
            "path": "/DEV/execution",
            "headers": {
                "cache-control": "no-cache",
                "postman-token": "b929e970-fe22-0f4f-e659-117890fda955"
            }
        };

        var account_key = req.body.input.account_key;

        var req1 = http.request(options, function (res1) {
            var chunks = [];

            res1.on("data", function (chunk) {
                chunks.push(chunk);
            });
            res1.on("end", function () {
                    if (err) throw err;

                    console.log("Connected!");
                setTimeout(function () {
                    con.query("select ollFrcRsnCde from fico_decisions.processed_records where account_key = " + account_key,
                        function (err, result) {
                            if (err) throw err;
                            console.log("Result: " + result[0].ollFrcRsnCde);
                            resultCode = result[0].ollFrcRsnCde;

                            var body = Buffer.concat(chunks);
                            console.log(body.toString());
                            res.write(resultCode.toString());
                            res.end();
                        })
                }, 6000);
            });
        });
        var input = req.body["input"];
        var name = req.body["name"];
        var inputString = (JSON.stringify(JSON.stringify(input)));
        var dataString = "{\n \"input\":" + inputString + "," + "\n\"name\":" + JSON.stringify(name) + ",\n" +
            "\"" + "stateMachineArn\": \"arn:aws:states:us-west-2:390458232574:stateMachine:FICO_StateMachine3\"" + "\n}";

        req1.write(dataString);
        req1.end();
	});

    });
};
