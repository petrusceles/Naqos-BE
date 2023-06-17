const BookingRepositories = require("../repositories/booking.repositories.js");
const UserRepositories = require("../repositories/user.repositories.js");
const KostRepositories = require("../repositories/kost.repositories.js");
const BookingPhaseRepositories = require("../repositories/booking.phase.repositories.js");
const CloudinaryUtils = require("../utils/cloudinary.utils.js");
const BookingPhase = require("../models/booking.phase.model.js");
const phaseOrder = ["booking", "payment", "confirmation"];
const createBookingService = async ({
  buyer_id,
  kost_id,
  in_date,
  out_date,
}) => {
  try {
    if (!buyer_id || !kost_id || !in_date || !out_date) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `all fields should be assigned`,
        data: {
          created_booking: null,
        },
      };
    }

    const buyer = await UserRepositories.findUserByIdRepo({ id: buyer_id });

    if (!buyer) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `user buyer with id ${buyer_id} doesn't exist`,
        data: {
          created_booking: null,
        },
      };
    }

    const kost = await KostRepositories.findKostByIdRepo({ id: kost_id });

    if (!kost) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `kost with id ${kost_id} doesn't exist`,
        data: {
          created_booking: null,
        },
      };
    }

    const phase = await BookingPhaseRepositories.findBookingPhasesByNameRepo({
      name: "booking",
    });

    const inDateFormated = new Date(in_date);

    if (isNaN(inDateFormated)) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `invalid in date format`,
        data: {
          created_booking: null,
        },
      };
    }

    const outDateFormated = new Date(out_date);

    if (isNaN(outDateFormated)) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `invalid out date format`,
        data: {
          created_booking: null,
        },
      };
    }

    const createdBooking = await BookingRepositories.createBookingRepo({
      buyer,
      kost,
      phase,
      in_date: inDateFormated,
      out_date: outDateFormated,
    });

    return {
      status: "SUCCESS",
      statusCode: 201,
      message: "booking created",
      data: {
        created_booking: createdBooking,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        created_booking: null,
      },
    };
  }
};

const findAllBookingsService = async () => {
  try {
    const bookings = await BookingRepositories.findAllBookingsRepo();
    if (!bookings?.length) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "bookings is empty",
        data: {
          bookings: null,
        },
      };
    }

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "bookings retrieved",
      data: {
        bookings: bookings,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        bookings: null,
      },
    };
  }
};

const findBookingByIdService = async ({ id }) => {
  try {
    const booking = await BookingRepositories.findBookingByIdRepo({ id });
    if (!booking) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `booking with id ${id} not found`,
        data: {
          booking: null,
        },
      };
    }
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: `booking retrieved`,
      data: {
        booking: booking,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        booking: null,
      },
    };
  }
};

const updateBookingByIdService = async ({
  id,
  user_id,
  phase_id,
  proof_photo,
  in_date,
  out_date,
}) => {
  try {
    let booking = await BookingRepositories.findBookingByIdRepo({ id });
    if (!booking) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `booking with id ${id} doesn't exist`,
        data: {
          updated_booking: null,
        },
      };
    }

    // let buyer;
    // if (buyer_id) {
    //   buyer = await UserRepositories.findUserByIdRepo({ id: buyer_id });
    //   if (!buyer) {
    //     return {
    //       status: "NOT_FOUND",
    //       statusCode: 404,
    //       message: `user with id ${buyer_id} doesn't exist`,
    //       data: {
    //         updated_booking: null,
    //       },
    //     };
    //   }
    // }

    // let kost;
    // if (kost_id) {
    //   kost = await KostRepositories.findKostByIdRepo({ id: kost_id });
    //   if (!kost) {
    //     return {
    //       status: "NOT_FOUND",
    //       statusCode: 404,
    //       message: `kost with id ${kost_id} doesn't exist`,
    //       data: {
    //         updated_booking: null,
    //       },
    //     };
    //   }
    // }

    let phase;
    if (phase_id) {
      if (user_id != booking.buyer._id && user_id != booking.kost.user._id) {
        return {
          status: "UNAUTHORIZED",
          statusCode: 401,
          message: `user not allowed to mopdify this data`,
          data: {
            updated_booking: null,
          },
        };
      }

      phase = await BookingPhaseRepositories.findBookingPhaseByIdRepo({
        id: phase_id,
      });

      if (
        phase.name != phaseOrder[phaseOrder.indexOf(booking.phase.name) + 1] &&
        phase.name != "failed"
      ) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: `cannot modify phase data by ignoring the phase order`,
          data: {
            updated_booking: null,
          },
        };
      }

      if (phase.name == "failed") {
        if (
          !(
            (booking.phase.name == "booking" && user_id == booking.buyer._id) ||
            (booking.phase.name == "payment" &&
              user_id == booking.kost.user._id)
          )
        ) {
          return {
            status: "BAD_REQUEST",
            statusCode: 400,
            message: `cannot modify phase to failed`,
            data: {
              updated_booking: null,
            },
          };
        }
      }

      if (phase.name == "payment" && user_id != booking.buyer._id) {
        return {
          status: "UNAUTHORIZED",
          statusCode: 401,
          message: `user not allowed to modify this data`,
          data: {
            updated_booking: null,
          },
        };
      }

      if (phase.name == "confirmation" && user_id != booking.kost.user._id) {
        return {
          status: "UNAUTHORIZED",
          statusCode: 401,
          message: `user not allowed to mopdify this data`,
          data: {
            updated_booking: null,
          },
        };
      }

      if (!phase) {
        return {
          status: "NOT_FOUND",
          statusCode: 404,
          message: `phase with id ${phase_id} doesn't exist`,
          data: {
            updated_booking: null,
          },
        };
      }
    }


    let inDateFormated;
    if (in_date) {
      if (user_id != booking.buyer._id) {
        return {
          status: "UNAUTHORIZED",
          statusCode: 401,
          message: `user not allowed to mopdify this data`,
          data: {
            updated_booking: null,
          },
        };
      }
      inDateFormated = new Date(in_date);
      if (isNaN(inDateFormated)) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: `invalid in date format`,
          data: {
            updated_booking: null,
          },
        };
      }
    }

    let outDateFormated;
    if (out_date) {
      if (user_id != booking.buyer._id) {
        return {
          status: "UNAUTHORIZED",
          statusCode: 401,
          message: `user not allowed to mopdify this data`,
          data: {
            updated_booking: null,
          },
        };
      }
      outDateFormated = new Date(out_date);
      if (isNaN(outDateFormated)) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: `invalid out date format`,
          data: {
            updated_booking: null,
          },
        };
      }
    }

    let proofPhotoUrl;
    if (proof_photo) {
      if (user_id != booking.buyer._id) {
        return {
          status: "UNAUTHORIZED",
          statusCode: 401,
          message: `user not allowed to mopdify this data`,
          data: {
            updated_booking: null,
          },
        };
      }
      const oldProofPhotoUrl = booking?.proof_photo_url;
      const proofPhotoResponse = await CloudinaryUtils.uploadToCloudinary(
        proof_photo,
        "ProofPhoto"
      );
      proofPhotoUrl = proofPhotoResponse.secure_url;
      if (oldProofPhotoUrl) {
        const oldProofPhotoPublicId =
          CloudinaryUtils.getPublicIdFromCloudinaryUrl(oldProofPhotoUrl);
        CloudinaryUtils.deleteAllImages([oldProofPhotoPublicId]);
      }
    }

    const updatedBooking = await BookingRepositories.updateBookingByIdRepo({
      id,
      phase,
      proof_photo_url: proofPhotoUrl,
      in_date: inDateFormated,
      out_date: outDateFormated,
    });
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: `booking updated`,
      data: {
        updated_booking: null,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        updated_booking: null,
      },
    };
  }
};

const deleteBookingById = async ({ id,user_id }) => {
  try {
    const booking = await BookingRepositories.findBookingByIdRepo({ id });

    if (user_id != booking.buyer._id && user_id != booking.kost.user._id) {
      return {
        status: "UNAUTHORIZED",
        statusCode: 401,
        message: `user not allowed to modify this data`,
        data: {
          deleted_booking: null,
        },
      };
    }

    if (!booking) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `booking with id ${id} doesn't exist`,
        data: {
          deleted_booking: null,
        },
      };
    }
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: `booking with id ${id} deleted`,
      data: {
        deleted_booking: null,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        deleted_booking: null,
      },
    };
  }
};

module.exports = {
  createBookingService,
  findAllBookingsService,
  findBookingByIdService,
  updateBookingByIdService,
  deleteBookingById,
};
