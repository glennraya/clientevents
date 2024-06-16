<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __invoke()
    {
        return User::whereNot(function (Builder $query) {
            $query->where('id', Auth::id());
        })
            ->get();
    }
}
