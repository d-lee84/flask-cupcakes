from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import InputRequired, URL, Optional


class AddCupcakeForm(FlaskForm):
    """ Form for adding cupcakes """

    flavor = StringField("Cupcake Flavor", validators=[InputRequired()])
    rating = IntegerField("Cupcake Rating", validators=[InputRequired()])
    size = StringField("Cupcake Size", validators=[InputRequired()])
    image = StringField("Cupcake Image", validators=[Optional(), URL()])

