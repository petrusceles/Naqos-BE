const BookingPhaseRepositories = require("../repositories/booking.phase.repositories.js");

const createBookingPhaseService = async ({ name }) => {
  try {
    const isBookingPhaseExist =
      await BookingPhaseRepositories.findBookingPhasesByNameRepo({
        name,
      });

    if (isBookingPhaseExist.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: "booking phase name has already exist",
        data: {
          created_booking_phase: null,
        },
      };
    }

    const newBookingPhase =
      await BookingPhaseRepositories.createBookingPhaseRepo({ name });
    return {
      status: "CREATED",
      statusCode: 201,
      message: "new booking phase is succesfully created",
      data: {
        created_booking_phase: newBookingPhase,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        created_booking_phase: null,
      },
    };
  }
};

const findAllBookingPhasesService = async () => {
  try {
    const bookingPhases =
      await BookingPhaseRepositories.findAllBookingPhasesRepo();
    if (!bookingPhases.length) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "booking phase is empty",
        data: {
          booking_phases: null,
        },
      };
    }

    return {
      status: "FOUND",
      statusCode: 200,
      message: "all booking phases succesfully retrieved",
      data: {
        booking_phases: bookingPhases,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        booking_phases: null,
      },
    };
  }
};

const findBookingPhaseByIdService = async ({ id }) => {
  try {
    const bookingPhase =
      await BookingPhaseRepositories.findBookingPhaseByIdRepo({ id });
    if (!bookingPhase) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "booking phase is empty",
        data: {
          booking_phase: null,
        },
      };
    }
    return {
      status: "FOUND",
      statusCode: 200,
      message: "booking phase found",
      data: {
        booking_phase: bookingPhase,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        booking_phase: null,
      },
    };
  }
};

const updateBookingPhaseByIdService = async ({ id, name }) => {
  try {
    if (!name || !id) {
      return {
        status: BAD_REQUEST,
        statusCode: 400,
        message: "name and id are required",
        data: {
          updated_booking_phase: null,
        },
      };
    }
    const isBookingPhaseExist =
      await BookingPhaseRepositories.findBookingPhaseByIdRepo({ id });
    if (!isBookingPhaseExist) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `booking phase with id ${id} doesn't exist`,
        data: {
          updated_booking_phase: null,
        },
      };
    }

    const isBookingPhaseNameExist =
      await BookingPhaseRepositories.findBookingPhasesByNameRepo({
        name,
      });
    if (isBookingPhaseNameExist.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `booking phase ${name} has already exist`,
        data: {
          updated_booking_phase: null,
        },
      };
    }

    const updatedBookingPhase =
      await BookingPhaseRepositories.updateBookingPhaseByIdRepo({ id, name });
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "booking phase succesfully updated",
      data: {
        updated_booking_phase: updatedBookingPhase,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        updated_booking_phase: null,
      },
    };
  }
};

const deleteBookingPhaseByIdService = async ({ id }) => {
  try {
    const isBookingPhaseExist =
      await BookingPhaseRepositories.findBookingPhaseByIdRepo({ id });
    if (!isBookingPhaseExist) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `booking phase with id ${id} doesn't exist`,
        data: {
          deleted_booking_phase: null,
        },
      };
    }
    const deletedBookingPhase =
      await BookingPhaseRepositories.deleteBookingPhaseByIdRepo({ id });
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: `booking phase with id ${id} is succesfully deleted`,
      data: {
        deleted_booking_phase: deletedBookingPhase,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        deleted_booking_phase: null,
      },
    };
  }
};

module.exports = {
  createBookingPhaseService,
  findAllBookingPhasesService,
  findBookingPhaseByIdService,
  updateBookingPhaseByIdService,
  deleteBookingPhaseByIdService,
};
