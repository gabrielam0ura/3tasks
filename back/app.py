from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:011711@localhost/tasks'
db = SQLAlchemy(app)
CORS(app, resources={r"/tasks/*": {"origins": "http://localhost:4444"}})

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    done = db.Column(db.Boolean, default=False)

with app.app_context():
    db.create_all()

@app.route('/tasks', methods=['GET', 'POST'])
def manage_tasks():
    if request.method == 'POST':
        data = request.json
        task = Task(title=data['title'])
        db.session.add(task)
        db.session.commit()
        return jsonify({"message": "Task created"}), 201
    tasks = Task.query.all()
    return jsonify([{"id": t.id, "title": t.title, "done": t.done} for t in tasks])

@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)
    if task:
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted"}), 200
    return jsonify({"message": "Task not found"}), 404

@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    data = request.json
    print(f"Recebido para editar: {data}")
    task = Task.query.get(id)
    if task:
        task.title = data['title']
        db.session.commit()
        return jsonify({"message": "Task updated"})
    return jsonify({"message": "Task not found"}), 404


if __name__ == '__main__':
    app.run(debug=True, port=5000)
