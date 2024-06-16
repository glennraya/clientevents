<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('messages.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
