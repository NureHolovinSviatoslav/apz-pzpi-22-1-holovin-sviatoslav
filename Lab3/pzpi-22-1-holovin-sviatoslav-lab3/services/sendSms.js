const { Notification } = require('../models/Notification');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const clientTwilio = require('twilio')(accountSid, authToken);

const processSending = async (objs) => {
  if (!objs.length) return;

  // console.log(JSON.stringify(objs, null, 2));

  for (const obj of objs) {
    const msg = `
      Добрий вечір ${obj.client_name}!

Нагадуємо, ми очікуємо на Вас завтра о ${obj.time}.

Деталі для замовлення:
  - тип: ${obj.type === 'item' ? 'Товар' : 'Замовлена подія'}
  - назва: ${obj.type === 'item' ? obj.item.name : obj.event.name}
  - ціна: ${obj.type === 'item' ? obj.item.price : obj.event.price} грн
  ${obj.type === 'event' ? `- Місце: ${obj.event.place}` : ''}

З повагою, Ваше ритуальне агенство)`;
    // const phone = obj.phone;
    const phone = '+';

    await clientTwilio.messages.create({
      body: msg,
      to: `whatsapp:${phone}`,
      from: 'whatsapp:+14155238886',
    });

    return;
  }
};

const formatAlertMessage = (data) => {
  return {
    phone: data.phone,
    message: `*ALERT!*
    Location: ${data.location_name}
    Address: ${data.location_address}
    Inventory: ${data.inventory_id}
    Vaccine: ${data.vaccine_name}
    ---
    Errors: ${data.error.low_temperature ? 'Low temperature | ' : ''}${
      data.error.high_temperature ? 'High temperature | ' : ''
    }${data.error.low_humidity ? 'Low humidity | ' : ''}${
      data.error.high_humidity ? 'High humidity | ' : ''
    }`.slice(0, -3),
  };
};

const formatOutOfStockMessage = (data) => {
  return {
    phone: data.phone,
    message: `*WARNING!*
    Location: ${data.location_name}
    Address: ${data.location_address}
    Inventory: ${data.inventory_id}
    Inventory Item: ${data.inventory_item_id}
    Vaccine: ${data.vaccine_name}
    ---
    *OUT OF STOCK!*`,
  };
};

const sendSms = async (data, notification_type) => {
  try {
    await clientTwilio.messages.create({
      body: data.message,
      to: `whatsapp:${process.env.DEFAULT_PHONE || data.phone}`,
      from: 'whatsapp:+14155238886',
    });

    await Notification.create({
      phone: data.phone,
      message: data.message,
      notification_type,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendSms, formatAlertMessage, formatOutOfStockMessage };
