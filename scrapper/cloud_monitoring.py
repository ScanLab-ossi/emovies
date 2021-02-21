from flask import Flask, request
import pandas as pd

app = Flask(__name__)

excel_monitor = {}


@app.route("/", methods=['POST'])
def excel_update():
    data = request.get_json()

    excel_monitor[data["cloud_name"]] = {
        "percentage": data["percentage"],
        "skipped_videos": data["skipped_videos"],
        "size": data["size"],
        "total_reviews": data["total_reviews"]
    }

    df = pd.DataFrame(excel_monitor)
    df.to_csv("monitor.csv")
    return 'OK'


if __name__ == '__main__':
    app.run(host='192.168.1.107', port=5000)
