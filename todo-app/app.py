from flask import Flask, redirect, render_template, request, url_for

# Create the Flask application object.
# Flask uses this object to know where routes, templates, and static files live.
app = Flask(__name__)

# This list stores our tasks while the app is running.
# Because this is in memory, tasks will reset whenever you stop/restart the app.
tasks = []

# This counter gives each new task a unique ID.
# IDs make it easy to update or delete the correct task.
next_task_id = 1


@app.route("/")
def index():
    """Show the to-do list page."""
    return render_template("index.html", tasks=tasks)


@app.route("/add", methods=["POST"])
def add_task():
    """Add a new task from the form on the page."""
    global next_task_id

    # request.form contains data submitted by an HTML form.
    title = request.form.get("title", "").strip()

    # Only add a task if the user typed something.
    if title:
        tasks.append(
            {
                "id": next_task_id,
                "title": title,
                "complete": False,
            }
        )
        next_task_id += 1

    # Redirect back to the home page after handling the form.
    return redirect(url_for("index"))


@app.route("/toggle/<int:task_id>", methods=["POST"])
def toggle_task(task_id):
    """Switch a task between complete and incomplete."""
    for task in tasks:
        if task["id"] == task_id:
            task["complete"] = not task["complete"]
            break

    return redirect(url_for("index"))


@app.route("/delete/<int:task_id>", methods=["POST"])
def delete_task(task_id):
    """Delete a task from the list."""
    global tasks

    # Keep every task except the one whose ID matches task_id.
    tasks = [task for task in tasks if task["id"] != task_id]

    return redirect(url_for("index"))


if __name__ == "__main__":
    # debug=True restarts the server when you change code and shows helpful errors.
    app.run(debug=True)
