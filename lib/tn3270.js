"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
var Observable_1 = require("rxjs/Observable");
var data_stream_1 = require("./data-stream");
var Tn3270 = (function () {
    function Tn3270(host, port, model) {
        var _this = this;
        this.host = host;
        this.port = port;
        this.model = model;
        this.modelBytes = [];
        for (var i = 0; i < model.length; i++)
            this.modelBytes.push(model.charCodeAt(i));
        this.stream$ = Observable_1.Observable.create(function (observer) {
            _this.socket = new net.Socket();
            _this.socket.on('data', function (data) { return _this.dataHandler(data, observer); });
            _this.socket.on('error', function (error) { return observer.error(error); });
            _this.socket.on('end', function () { return observer.complete(); });
            _this.socket.setNoDelay(true);
            _this.socket.connect({ host: host, port: port }, function () {
                console.log("Connected to " + host + ":" + port);
            });
            return function () { return _this.socket.destroy(); };
        });
    }
    Tn3270.prototype.write = function (bytes) {
        if (bytes instanceof Buffer)
            this.socket.write(bytes);
        else
            this.socket.write(Buffer.from(bytes));
    };
    Tn3270.prototype.dataHandler = function (data, observer) {
        if (data[0] === data_stream_1.Telnet.IAC) {
            console.log('IAC', data);
            if (data[1] === data_stream_1.Telnet.DO && data[2] === data_stream_1.Telnet.TERMINAL_TYPE)
                this.write([data_stream_1.Telnet.IAC, data_stream_1.Telnet.WILL, data_stream_1.Telnet.TERMINAL_TYPE]);
            if (data[1] === data_stream_1.Telnet.DO && data[2] === data_stream_1.Telnet.EOR)
                this.write([data_stream_1.Telnet.IAC, data_stream_1.Telnet.WILL, data_stream_1.Telnet.EOR, data_stream_1.Telnet.IAC, data_stream_1.Telnet.DO, data_stream_1.Telnet.EOR]);
            if (data[1] === data_stream_1.Telnet.DO && data[2] === data_stream_1.Telnet.BINARY)
                this.write([data_stream_1.Telnet.IAC, data_stream_1.Telnet.WILL, data_stream_1.Telnet.BINARY, data_stream_1.Telnet.IAC, data_stream_1.Telnet.DO, data_stream_1.Telnet.BINARY]);
            if (data[1] === data_stream_1.Telnet.SB && data[2] === data_stream_1.Telnet.TERMINAL_TYPE)
                this.write([data_stream_1.Telnet.IAC, data_stream_1.Telnet.SB, data_stream_1.Telnet.TERMINAL_TYPE, 0].concat(this.modelBytes, [data_stream_1.Telnet.IAC, data_stream_1.Telnet.SE]));
        }
        else
            observer.next(data);
    };
    return Tn3270;
}());
exports.Tn3270 = Tn3270;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG4zMjcwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3RuMzI3MC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUEyQjtBQUUzQiw4Q0FBNkM7QUFFN0MsNkNBQXVDO0FBVXZDO0lBUUUsZ0JBQW1CLElBQVksRUFDWixJQUFZLEVBQ1osS0FBYTtRQUZoQyxpQkFrQkM7UUFsQmtCLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUx4QixlQUFVLEdBQWEsRUFBRSxDQUFDO1FBT2hDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7WUFDbkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTVDLElBQUksQ0FBQyxPQUFPLEdBQUcsdUJBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxRQUEwQjtZQUMxRCxLQUFJLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQy9CLEtBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFDLElBQVksSUFBSyxPQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxFQUFoQyxDQUFnQyxDQUFDLENBQUM7WUFDM0UsS0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBWSxJQUFLLE9BQUEsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDO1lBQ2pFLEtBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxjQUFNLE9BQUEsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFuQixDQUFtQixDQUFDLENBQUM7WUFDakQsS0FBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsS0FBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBQyxJQUFJLE1BQUEsRUFBRSxJQUFJLE1BQUEsRUFBQyxFQUFFO2dCQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFnQixJQUFJLFNBQUksSUFBTSxDQUFDLENBQUM7WUFDOUMsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQXJCLENBQXFCLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0Qsc0JBQUssR0FBTCxVQUFNLEtBQVU7UUFDZCxFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksTUFBTSxDQUFDO1lBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLElBQUk7WUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUlPLDRCQUFXLEdBQW5CLFVBQW9CLElBQVksRUFDWixRQUEwQjtRQUM1QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssb0JBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxvQkFBTSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssb0JBQU0sQ0FBQyxhQUFhLENBQUM7Z0JBQzVELElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxvQkFBTSxDQUFDLEdBQUcsRUFBRSxvQkFBTSxDQUFDLElBQUksRUFBRSxvQkFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDOUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLG9CQUFNLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxvQkFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLG9CQUFNLENBQUMsR0FBRyxFQUFFLG9CQUFNLENBQUMsSUFBSSxFQUFFLG9CQUFNLENBQUMsR0FBRyxFQUFFLG9CQUFNLENBQUMsR0FBRyxFQUFFLG9CQUFNLENBQUMsRUFBRSxFQUFFLG9CQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN2RixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssb0JBQU0sQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLG9CQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNyRCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsb0JBQU0sQ0FBQyxHQUFHLEVBQUUsb0JBQU0sQ0FBQyxJQUFJLEVBQUUsb0JBQU0sQ0FBQyxNQUFNLEVBQUUsb0JBQU0sQ0FBQyxHQUFHLEVBQUUsb0JBQU0sQ0FBQyxFQUFFLEVBQUUsb0JBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzdGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxvQkFBTSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssb0JBQU0sQ0FBQyxhQUFhLENBQUM7Z0JBQzVELElBQUksQ0FBQyxLQUFLLEVBQUUsb0JBQU0sQ0FBQyxHQUFHLEVBQUUsb0JBQU0sQ0FBQyxFQUFFLEVBQUUsb0JBQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxTQUFLLElBQUksQ0FBQyxVQUFVLEdBQUUsb0JBQU0sQ0FBQyxHQUFHLEVBQUUsb0JBQU0sQ0FBQyxFQUFFLEdBQUUsQ0FBQztRQUM1RyxDQUFDO1FBQ0QsSUFBSTtZQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVILGFBQUM7QUFBRCxDQUFDLEFBckRELElBcURDO0FBckRZLHdCQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbmV0IGZyb20gJ25ldCc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT2JzZXJ2ZXIgfSBmcm9tICdyeGpzL09ic2VydmVyJztcbmltcG9ydCB7IFRlbG5ldCB9IGZyb20gJy4vZGF0YS1zdHJlYW0nO1xuXG4vKipcbiAqIFJhdyBUZWxuZXQgdG8gMzI3MFxuICpcbiAqIEBzZWUgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzE1NzZcbiAqIEBzZWUgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzE2NDdcbiAqIEBzZWUgaHR0cDovL3VzZXJzLmNzLmNmLmFjLnVrL0RhdmUuTWFyc2hhbGwvSW50ZXJuZXQvbm9kZTE0MS5odG1sXG4gKi9cblxuZXhwb3J0IGNsYXNzIFRuMzI3MCB7XG5cbiAgc3RyZWFtJDogT2JzZXJ2YWJsZTxCdWZmZXI+O1xuXG4gIHByaXZhdGUgc29ja2V0OiBuZXQuU29ja2V0O1xuICBwcml2YXRlIG1vZGVsQnl0ZXM6IG51bWJlcltdID0gW107XG5cbiAgLyoqIGN0b3IgKi9cbiAgY29uc3RydWN0b3IocHVibGljIGhvc3Q6IHN0cmluZyxcbiAgICAgICAgICAgICAgcHVibGljIHBvcnQ6IG51bWJlcixcbiAgICAgICAgICAgICAgcHVibGljIG1vZGVsOiBzdHJpbmcpIHtcbiAgICAvLyB3ZSBuZWVkIHRoZSBtb2RlbCBhcyBhbiBhcnJheSBvZiBieXRlc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW9kZWwubGVuZ3RoOyBpKyspXG4gICAgICB0aGlzLm1vZGVsQnl0ZXMucHVzaChtb2RlbC5jaGFyQ29kZUF0KGkpKTtcbiAgICAvLyBidWlsZCBvYnNlcnZhYmxlIHN0cmVhbSBvdmVyIDMyNzAgZGF0YVxuICAgIHRoaXMuc3RyZWFtJCA9IE9ic2VydmFibGUuY3JlYXRlKChvYnNlcnZlcjogT2JzZXJ2ZXI8QnVmZmVyPikgPT4ge1xuICAgICAgdGhpcy5zb2NrZXQgPSBuZXcgbmV0LlNvY2tldCgpO1xuICAgICAgdGhpcy5zb2NrZXQub24oJ2RhdGEnLCAoZGF0YTogQnVmZmVyKSA9PiB0aGlzLmRhdGFIYW5kbGVyKGRhdGEsIG9ic2VydmVyKSk7XG4gICAgICB0aGlzLnNvY2tldC5vbignZXJyb3InLCAoZXJyb3I6IEVycm9yKSA9PiBvYnNlcnZlci5lcnJvcihlcnJvcikpO1xuICAgICAgdGhpcy5zb2NrZXQub24oJ2VuZCcsICgpID0+IG9ic2VydmVyLmNvbXBsZXRlKCkpO1xuICAgICAgdGhpcy5zb2NrZXQuc2V0Tm9EZWxheSh0cnVlKTtcbiAgICAgIHRoaXMuc29ja2V0LmNvbm5lY3Qoe2hvc3QsIHBvcnR9LCAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBDb25uZWN0ZWQgdG8gJHtob3N0fToke3BvcnR9YCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiAoKSA9PiB0aGlzLnNvY2tldC5kZXN0cm95KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogV3JpdGUgcmF3IGJ5dGVzIHRvIDMyNzAgKi9cbiAgd3JpdGUoYnl0ZXM6IGFueSk6IHZvaWQge1xuICAgIGlmIChieXRlcyBpbnN0YW5jZW9mIEJ1ZmZlcilcbiAgICAgIHRoaXMuc29ja2V0LndyaXRlKGJ5dGVzKTtcbiAgICBlbHNlIHRoaXMuc29ja2V0LndyaXRlKEJ1ZmZlci5mcm9tKGJ5dGVzKSk7XG4gIH1cblxuICAvLyBwcml2YXRlIG1ldGhvZHNcblxuICBwcml2YXRlIGRhdGFIYW5kbGVyKGRhdGE6IEJ1ZmZlcixcbiAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlcjogT2JzZXJ2ZXI8QnVmZmVyPik6IHZvaWQge1xuICAgIGlmIChkYXRhWzBdID09PSBUZWxuZXQuSUFDKSB7XG4gICAgICBjb25zb2xlLmxvZygnSUFDJywgZGF0YSk7XG4gICAgICBpZiAoZGF0YVsxXSA9PT0gVGVsbmV0LkRPICYmIGRhdGFbMl0gPT09IFRlbG5ldC5URVJNSU5BTF9UWVBFKVxuICAgICAgICB0aGlzLndyaXRlKFtUZWxuZXQuSUFDLCBUZWxuZXQuV0lMTCwgVGVsbmV0LlRFUk1JTkFMX1RZUEVdKTtcbiAgICAgIGlmIChkYXRhWzFdID09PSBUZWxuZXQuRE8gJiYgZGF0YVsyXSA9PT0gVGVsbmV0LkVPUilcbiAgICAgICAgdGhpcy53cml0ZShbVGVsbmV0LklBQywgVGVsbmV0LldJTEwsIFRlbG5ldC5FT1IsIFRlbG5ldC5JQUMsIFRlbG5ldC5ETywgVGVsbmV0LkVPUl0pO1xuICAgICAgaWYgKGRhdGFbMV0gPT09IFRlbG5ldC5ETyAmJiBkYXRhWzJdID09PSBUZWxuZXQuQklOQVJZKVxuICAgICAgICB0aGlzLndyaXRlKFtUZWxuZXQuSUFDLCBUZWxuZXQuV0lMTCwgVGVsbmV0LkJJTkFSWSwgVGVsbmV0LklBQywgVGVsbmV0LkRPLCBUZWxuZXQuQklOQVJZXSk7XG4gICAgICBpZiAoZGF0YVsxXSA9PT0gVGVsbmV0LlNCICYmIGRhdGFbMl0gPT09IFRlbG5ldC5URVJNSU5BTF9UWVBFKVxuICAgICAgICB0aGlzLndyaXRlKFtUZWxuZXQuSUFDLCBUZWxuZXQuU0IsIFRlbG5ldC5URVJNSU5BTF9UWVBFLCAwLCAuLi50aGlzLm1vZGVsQnl0ZXMsIFRlbG5ldC5JQUMsIFRlbG5ldC5TRV0pO1xuICAgIH1cbiAgICBlbHNlIG9ic2VydmVyLm5leHQoZGF0YSk7XG4gIH1cblxufVxuIl19