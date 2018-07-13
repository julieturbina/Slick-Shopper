const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientConsultationSchema = new Schema({
consultationDate: Date,
user: { type: Schema.Types.ObjectId, ref: 'User' },
provider: { type: Schema.Types.ObjectId, ref: 'User' }
});

clientConsultationSchema.set('timestamps', true);

const ClientConsultation = mongoose.model('ClientConsultation', clientConsultationSchema);

module.exports = ClientConsultation;
