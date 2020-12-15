"""Flask app for Cupcakes"""
from flask import Flask, jsonify, request, render_template

from flask_debugtoolbar import DebugToolbarExtension

from models import db, connect_db, Cupcake

from forms import AddCupcakeForm

app = Flask(__name__)

app.config['SECRET_KEY'] = "secret"

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql:///cupcakes"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

connect_db(app)
db.create_all()

app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

toolbar = DebugToolbarExtension(app)

########################################################
# Homepage Route

@app.route("/")
def show_homepage():
    """ Show the homepage to show and add cupcakes """

    form = AddCupcakeForm()

    return render_template('base.html', form=form)

########################################################
# Cupcakes API Routes

@app.route("/api/cupcakes")
def get_all_cupcakes():
    """ Get all the data about cupcakes 
    Returns JSON of list of serialized cupcakes like: 
    {cupcakes: [{id, flavor, size, rating, image}, ...]} """

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
    """ Create a new cupcake, return JSON with status code 201
        Respond with JSON like: {cupcake: {id, flavor, size, rating, image}}.
    """

    flavor = request.json['flavor']
    size = request.json['size']
    rating = request.json['rating']
    image = request.json['image'] or None

    new_cupcake = Cupcake(flavor=flavor,
                          size=size,
                          rating=rating,
                          image=image)

    db.session.add(new_cupcake)
    db.session.commit()

    return (jsonify(cupcake=new_cupcake.serialize()), 201)


@app.route("/api/cupcakes/<int:cupcake_id>", methods=["PATCH"])
def update_cupcake(cupcake_id):
    """ Updates the cupcake from request data and returns it

    Returns with JSON like: {cupcake: {id, flavor, size, rating, image}}.
    """

    cupcake = Cupcake.query.get(cupcake_id)

    if not cupcake:
        message = "Cupcake does not exist"
        return (jsonify(error=message), 404)

    # If we want to update only parts of the data,
    # use .get here or the current value if JSON body has no data
    cupcake.flavor = request.json.get('flavor') or cupcake.flavor
    cupcake.size = request.json.get('size') or cupcake.size
    cupcake.rating = request.json.get('rating') or cupcake.rating
    cupcake.image = request.json.get('image') or cupcake.image

    db.session.commit()

    return jsonify(cupcake=cupcake.serialize())


@app.route("/api/cupcakes/<int:cupcake_id>", methods=["DELETE"])
def delete_cupcake(cupcake_id):
    """ Deletes the cupcake at cupcake_id and returns a success message
        {message: "Deleted"}
    If cupcake not found, raise a 404 error message
    """

    cupcake = Cupcake.query.get(cupcake_id)
    message = "Deleted" if cupcake else "Cupcake does not exist"

    if not cupcake:
        return (jsonify(message=message), 404)

    db.session.delete(cupcake)
    db.session.commit()

    return jsonify(message=message)


@app.route("/api/cupcakes/search")
def search_cupcakes_by_term():
    """ Gets all cupcakes from database filtered by search term
    returning JSON of a list of serialized cupcakes like: 
    {cupcakes: [{id, flavor, size, rating, image}, ...]}  """

    search_term = request.args["search_term"]

    filtered_cupcakes = Cupcake.query.filter(
        Cupcake.flavor.ilike(f"%{search_term}%")
    )

    serialized = [cupcake.serialize() for cupcake in filtered_cupcakes]
    return jsonify(cupcakes=serialized)
