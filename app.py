"""Flask app for Cupcakes"""
from flask import Flask, jsonify, request

from flask_debugtoolbar import DebugToolbarExtension

from models import db, connect_db, Cupcake

app = Flask(__name__)

app.config['SECRET_KEY'] = "secret"

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql:///cupcakes"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

connect_db(app)
db.create_all()

app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

toolbar = DebugToolbarExtension(app)


@app.route("/api/cupcakes")
def get_all_cupcakes():
    """ Get all the data about cupcakes """

    cupcakes = Cupcake.query.all()
    serialized_list = [cupcake.serialize() for cupcake in cupcakes]

    return jsonify(cupcakes=serialized_list)


@app.route("/api/cupcakes/<int:cupcake_id>")
def get_a_cupcake(cupcake_id):
    """ Return serialized version of cupcake with cupcake id
        If not found, return 404 with error message
    """

    cupcake = Cupcake.query.get(cupcake_id)

    # Return error if cupcake is not found
    if cupcake:
        serialized = cupcake.serialize()
    else:
        message = "Cupcake does not exist"
        return (jsonify(error=message), 404)

    return jsonify(cupcake=serialized)


@app.route("/api/cupcakes", methods=["POST"])
def create_cupcake():
    """ Create a new cupcake, return JSON with status code 201 """

    flavor = request.json.get('flavor')
    size = request.json.get('size')
    rating = request.json.get('rating')
    image = request.json.get('image')

    new_cupcake = Cupcake(flavor=flavor,
                          size=size,
                          rating=rating,
                          image=image)

    db.session.add(new_cupcake)
    db.session.commit()

    return (jsonify(cupcake=new_cupcake.serialize()), 201)

